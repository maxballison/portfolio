"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import {
  VolumeRenderer,
  loadVolume,
  type VolumeManifest,
} from "@/app/components/brainVolumeRenderer";

const MANIFEST_URL = "/brain/volume/brain2-volume.json";

type Status = "idle" | "loading" | "ready" | "error" | "unsupported";
type Mode = "translucent" | "xray" | "mip";
type Quality = "low" | "medium" | "high";

const MODE_INDEX: Record<Mode, 0 | 1 | 2> = { translucent: 0, xray: 1, mip: 2 };
const QUALITY_STEPS: Record<Quality, number> = { low: 96, medium: 160, high: 288 };
const QUALITY_SCALE: Record<Quality, number> = { low: 0.6, medium: 0.85, high: 1 };

/**
 * Interactive volumetric rendering of the brain2 MRI stack: the 176 sagittal
 * slices fused into a 3D texture and raymarched in WebGL2. Drag to rotate,
 * wheel/pinch to zoom. The volume atlas (~5 MB) only loads once the window
 * scrolls near the viewport.
 */
export function BrainVolume() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<VolumeRenderer | null>(null);
  const rafRef = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef(0);
  const visibleRef = useRef(false);
  const interactedRef = useRef(false);

  const reduceMotion = useReducedMotion() ?? false;

  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [density, setDensity] = useState(0.45);
  const [low, setLow] = useState(0.05);
  const [high, setHigh] = useState(0.6);
  const [clip, setClip] = useState(1);
  const [mode, setMode] = useState<Mode>("translucent");
  const [quality, setQuality] = useState<Quality>("medium");
  const [brainOnly, setBrainOnly] = useState(false);

  /** Draw one frame (render-on-demand; no continuous loop unless spinning). */
  const requestRender = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      rendererRef.current?.render();
    });
  }, []);

  // Lazy-init: start loading the volume when the window scrolls near.
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0].isIntersecting;
        if (entries[0].isIntersecting) setStatus((s) => (s === "idle" ? "loading" : s));
      },
      { rootMargin: "400px" }
    );
    io.observe(holder);
    return () => io.disconnect();
  }, []);

  // Load manifest + atlas, build the renderer.
  useEffect(() => {
    if (status !== "loading") return;
    let cancelled = false;
    (async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const manifest: VolumeManifest = await (await fetch(MANIFEST_URL)).json();
        // main atlas drives the progress bar; the mask atlas is ~20x smaller
        const [voxels, maskVoxels] = await Promise.all([
          loadVolume(manifest, (f) => {
            if (!cancelled) setProgress(f);
          }),
          loadVolume(manifest, undefined, manifest.maskAtlas),
        ]);
        if (cancelled) return;
        const renderer = new VolumeRenderer(canvas);
        renderer.setVolume(
          voxels,
          manifest.width,
          manifest.height,
          manifest.depth,
          manifest.spacing
        );
        renderer.setMask(maskVoxels, manifest.width, manifest.height, manifest.depth);
        rendererRef.current = renderer;
        setLow(manifest.window.low / 255);
        setHigh(manifest.window.high / 255);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus(err instanceof Error && err.message === "webgl2-unsupported" ? "unsupported" : "error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  // Push UI params into the renderer.
  useEffect(() => {
    const r = rendererRef.current;
    if (!r || status !== "ready") return;
    r.params = {
      density,
      low,
      high,
      clip,
      mode: MODE_INDEX[mode],
      steps: QUALITY_STEPS[quality],
      brainOnly,
    };
    requestRender();
  }, [status, density, low, high, clip, mode, quality, brainOnly, requestRender]);

  // Size the drawing buffer to the element (scaled by quality), re-render.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || status !== "ready") return;
    const scale = QUALITY_SCALE[quality] * Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const size = canvas.clientWidth;
      const px = Math.max(1, Math.round(size * scale));
      if (canvas.width !== px || canvas.height !== px) {
        canvas.width = px;
        canvas.height = px;
        requestRender();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [status, quality, requestRender]);

  // Idle auto-rotate: slow spin until first interaction; honors reduced motion.
  useEffect(() => {
    if (status !== "ready" || reduceMotion) return;
    let raf = 0;
    const tick = () => {
      const r = rendererRef.current;
      if (r && visibleRef.current && !interactedRef.current && pointers.current.size === 0) {
        r.theta += 0.003;
        r.render();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, reduceMotion]);

  // Wheel zoom needs a non-passive listener to preventDefault page scroll.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || status !== "ready") return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      interactedRef.current = true;
      rendererRef.current?.zoom(e.deltaY > 0 ? 1.08 : 1 / 1.08);
      requestRender();
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [status, requestRender]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Pointer interaction: one pointer rotates, two pinch-zoom.
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    interactedRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    const r = rendererRef.current;
    if (!r) return;
    if (pointers.current.size === 1) {
      r.rotate(cur.x - prev.x, cur.y - prev.y);
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist.current > 0) r.zoom(pinchDist.current / d);
      pinchDist.current = d;
    }
    requestRender();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    pinchDist.current = 0;
  };

  const resetView = () => {
    // clearing the interacted flag lets the idle auto-spin resume
    interactedRef.current = false;
    rendererRef.current?.resetView();
    requestRender();
  };

  const pct = Math.round(progress * 100);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {/* Viewport */}
      <div ref={holderRef} className="sunken-panel min-w-0 flex-1 bg-black p-1">
        <div className="relative aspect-square w-full">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none", imageRendering: "auto" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={resetView}
            aria-label="Interactive 3D rendering of my brain from MRI slices. Drag to rotate, scroll to zoom."
            role="img"
          />
          {status !== "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              {status === "loading" || status === "idle" ? (
                <>
                  <p className="font-pixel text-lg text-lcd-text">
                    LOADING VOLUME{progress > 0 ? ` ${pct}%` : ""}
                  </p>
                  <div
                    className="h-3 w-40 border border-lcd-grid bg-lcd-deep"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full bg-lcd-text" style={{ width: `${pct}%` }} />
                  </div>
                </>
              ) : status === "unsupported" ? (
                <p className="font-pixel text-lg text-lcd-text-dim">
                  THIS DISPLAY REQUIRES WEBGL2 :(
                </p>
              ) : (
                <p className="font-pixel text-lg text-lcd-text-dim">VOLUME FAILED TO LOAD</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <fieldset className="shrink-0 md:w-56">
        <legend>Render controls</legend>
        <div className="flex flex-col gap-2 p-1">
          <div className="field-row">
            <input
              id="bv-brainonly"
              type="checkbox"
              checked={brainOnly}
              onChange={(e) => setBrainOnly(e.target.checked)}
            />
            <label htmlFor="bv-brainonly">Brain only (skull-stripped)</label>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="bv-mode" className="w-14 shrink-0">Mode</label>
            <select
              id="bv-mode"
              className="min-w-0 flex-1"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="translucent">Translucent</option>
              <option value="xray">X-ray</option>
              <option value="mip">Max intensity</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="bv-quality" className="w-14 shrink-0">Quality</label>
            <select
              id="bv-quality"
              className="min-w-0 flex-1"
              value={quality}
              onChange={(e) => setQuality(e.target.value as Quality)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <label htmlFor="bv-density" className="mt-1">
            Opacity {mode === "mip" ? "(n/a in this mode)" : ""}
          </label>
          <input
            id="bv-density"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={density}
            disabled={mode === "mip"}
            onChange={(e) => setDensity(Number(e.target.value))}
          />

          <label htmlFor="bv-floor">Tissue floor (hides darker matter)</label>
          <input
            id="bv-floor"
            type="range"
            min={0}
            max={0.6}
            step={0.005}
            value={low}
            onChange={(e) => setLow(Number(e.target.value))}
          />

          <label htmlFor="bv-ceiling">Brightness ceiling</label>
          <input
            id="bv-ceiling"
            type="range"
            min={0.2}
            max={1}
            step={0.005}
            value={high}
            onChange={(e) => setHigh(Number(e.target.value))}
          />

          <label htmlFor="bv-clip">Sagittal cut (slice through)</label>
          <input
            id="bv-clip"
            type="range"
            min={0.02}
            max={1}
            step={0.005}
            value={clip}
            onChange={(e) => setClip(Number(e.target.value))}
          />

          <button type="button" className="transport mt-1 gap-1 self-start px-2" onClick={resetView}>
            <ArrowCounterClockwiseIcon size={12} aria-hidden="true" />
            <span className="text-[11px]">Reset view</span>
          </button>
        </div>
      </fieldset>
    </div>
  );
}
