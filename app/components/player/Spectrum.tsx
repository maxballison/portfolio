"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { usePlayer } from "./PlayerProvider";

/**
 * Classic segmented spectrum analyzer drawn on canvas.
 * Reads the shared AnalyserNode; when idle or reduced-motion, renders a dim
 * static baseline instead of animating.
 */
export function Spectrum({
  bars = 19,
  className,
}: {
  bars?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, getAnalyser } = usePlayer();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    const segH = 3; // segment height
    const segGap = 1;
    const barGap = 2;
    const barW = (cssW - barGap * (bars - 1)) / bars;
    const maxSegs = Math.floor(cssH / (segH + segGap));

    const lo = getComputedStyle(document.documentElement).getPropertyValue("--spec-lo").trim() || "#4fae62";
    const hi = getComputedStyle(document.documentElement).getPropertyValue("--spec-hi").trim() || "#d9c04a";
    const dim = getComputedStyle(document.documentElement).getPropertyValue("--lcd-grid").trim() || "#1b2342";

    const drawFrame = (levels: number[]) => {
      ctx.clearRect(0, 0, cssW, cssH);
      for (let b = 0; b < bars; b++) {
        const litSegs = Math.round(levels[b] * maxSegs);
        for (let s = 0; s < maxSegs; s++) {
          const y = cssH - (s + 1) * (segH + segGap);
          if (s < litSegs) {
            // Bottom segments green, top segments gold
            ctx.fillStyle = s / maxSegs > 0.65 ? hi : lo;
          } else {
            ctx.fillStyle = dim;
          }
          ctx.fillRect(b * (barW + barGap), y, barW, segH);
        }
      }
    };

    // Static baseline when idle or reduced motion
    const staticLevels = Array.from({ length: bars }, () => 0);

    if (reduceMotion || !isPlaying) {
      drawFrame(staticLevels);
      return;
    }

    const analyser = getAnalyser();
    if (!analyser) {
      drawFrame(staticLevels);
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;

    const loop = () => {
      analyser.getByteFrequencyData(data);
      const levels: number[] = [];
      // Log-ish bucketing: low bins get more resolution, like the original
      for (let b = 0; b < bars; b++) {
        const start = Math.floor(Math.pow(b / bars, 1.6) * data.length * 0.7);
        const end = Math.max(
          start + 1,
          Math.floor(Math.pow((b + 1) / bars, 1.6) * data.length * 0.7)
        );
        let sum = 0;
        for (let i = start; i < end; i++) sum += data[i];
        levels.push(Math.min(1, sum / (end - start) / 200));
      }
      drawFrame(levels);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [bars, isPlaying, reduceMotion, getAnalyser]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
