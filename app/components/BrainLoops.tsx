"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { brainScans } from "@/app/data/brains";
import { WindowFrame } from "@/app/components/WindowFrame";
import { BrainVolumeWindow } from "@/app/components/BrainVolumeWindow";

/**
 * Flipbook player for one MRI sequence: a single <img> whose src advances
 * through the frames. All frames are preloaded on mount so the loop is
 * smooth after the first cycle. Frames are letterboxed into a square black
 * viewport so mixed image dimensions render at a uniform size.
 */
function ScanLoop({ frames, fps }: { frames: string[]; fps: number }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  // Preload every frame once
  useEffect(() => {
    frames.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [frames]);

  useEffect(() => {
    if (reduceMotion || frames.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [frames.length, fps, reduceMotion]);

  return (
    <div className="relative aspect-square w-full bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element -- flipbook swaps src every frame; next/image adds no value here */}
      <img
        src={frames[index]}
        alt="MRI scan of my brain, animated slice sequence"
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

/** Per-folder playback speed, keyed by scan id (folder name). */
export type FpsMap = Record<string, number>;

const DEFAULT_FPS = 8;

/**
 * Window that shows every scan folder as its own looping animation,
 * side by side. Scales to however many folders exist in brains.ts.
 * Loops run independently; they do not need to finish together.
 */
export function BrainLoops({ fps = {} }: { fps?: FpsMap }) {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <WindowFrame
      title="My Actual Brain.exe"
      windowId="brain"
      statusFields={[
        `${brainScans.length} scan(s)`,
        `${brainScans.reduce((n, s) => n + s.frames.length, 0)} slices`,
      ]}
    >
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${brainScans.length}, minmax(0, 1fr))` }}
      >
        {brainScans.map((brainScan) => (
          <div key={brainScan.id} className="sunken-panel bg-black p-1">
            <ScanLoop
              frames={brainScan.frames}
              fps={fps[brainScan.id] ?? DEFAULT_FPS}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px]">
          These are real MRI scans of my brain, played back as loops.
        </p>
        <button
          type="button"
          className="default"
          onClick={() => setViewerOpen(true)}
        >
          Reconstruct my brain in 3D
        </button>
      </div>
      {viewerOpen && <BrainVolumeWindow onClose={() => setViewerOpen(false)} />}
    </WindowFrame>
  );
}
