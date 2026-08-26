"use client";

import { useEffect, useRef, useState } from "react";
import { WindowFrame } from "@/app/components/WindowFrame";
import { BrainVolume } from "@/app/components/BrainVolume";

/**
 * brainvol.exe: volumetric 3D reconstruction of the brain2 MRI stack,
 * launched from brain.exe like a program opening. Renders as a floating
 * centered window (draggable via its title bar, closable via X or Esc).
 * Unmounting on close frees the WebGL context.
 */
export function BrainVolumeWindow({ onClose }: { onClose: () => void }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  // Focus on open (so Esc works immediately); restore focus on close.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    holderRef.current?.focus();
    return () => prev?.focus();
  }, []);

  return (
    <>
      {/* Below the taskbar (100000) and help dialog, above page windows */}
      <div className="pointer-events-none fixed inset-0 z-[99998] flex items-center justify-center p-3 pb-12">
        <div
          ref={holderRef}
          tabIndex={-1}
          role="dialog"
          aria-label="brainvol.exe volumetric viewer"
          className="pointer-events-auto w-full max-w-2xl outline-none"
          onKeyDown={(e) => {
            if (e.key === "Escape" && !helpOpen) onClose();
          }}
        >
          <WindowFrame
            title="brainvol.exe - volumetric viewer"
            windowId="brain3d"
            statusFields={["192 x 256 x 160 voxels", "Drag to rotate / scroll to zoom"]}
            onHelp={() => setHelpOpen(true)}
            onClose={onClose}
          >
            {/* Content scrolls internally on short screens; the wrapper must
                NOT scroll or dragging the window would clip against it */}
            <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto">
              <BrainVolume />
              <p className="mt-2 text-[11px]">
                The 176 sagittal MRI slices from brain.exe, stacked back into the
                3D volume they were cut from and raymarched live on your GPU.
                Turn the opacity down to see through my skull, use the sagittal
                cut to slice me open, or check Brain only to strip away everything
                but the brain itself. Click the ? for how this works.
              </p>
            </div>
          </WindowFrame>
        </div>
      </div>
      {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} />}
    </>
  );
}

/** Modal Win98 dialog: how the 3D brain was created and rendered. */
function HelpDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog on open so Esc works immediately and screen readers land
  // on it; restore focus to the trigger when it closes.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => prev?.focus();
  }, []);

  return (
    // z-index above the taskbar (100000); windowRegistry z-indexes stay below it
    <div
      className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brainhelp-title"
        tabIndex={-1}
        className="window max-h-full w-full max-w-md overflow-y-auto outline-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        <div className="title-bar">
          <div className="title-bar-text" id="brainhelp-title">
            How this works - brainvol.exe
          </div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <div className="window-body">
          <div className="space-y-2 text-[11px] leading-relaxed">
            <p>
              I got an MRI on my head, and they gave me a bunch of separate
              pictures of my brain: 176 thin vertical slices, scanned ear to
              ear, each about a millimeter apart.
            </p>
            <p>
              Because the slices are parallel and evenly spaced, stacking them
              in order rebuilds the solid 3D block of head they were cut from,
              the way a loaf of bread reassembles from its slices. Every pixel
              of every slice becomes a tiny cube in that block (a voxel), and
              its brightness is the MRI signal at that exact spot in my head.
            </p>
            <p>
              To draw it, your graphics card runs a technique called ray
              casting, the same one used by hospital imaging software. For
              every pixel on screen, it shoots an imaginary ray into the
              block and takes hundreds of tiny steps, letting tissue along
              the way glow and absorb light like colored glass. The opacity
              slider controls how absorbing the tissue is: turn it down and
              the outer layers fade, so you can see the folds through the
              skull. The lighting comes from measuring which way tissue
              density changes at each step, which is what makes the folds
              look carved instead of flat.
            </p>
            <p>
              Brain only mode uses a second, invisible volume computed ahead
              of time: a map of which voxels are brain versus scalp, skull,
              and face. It is made the way clinical tools do it: shrink the
              tissue map until the dark skull gap cuts the brain free from
              the scalp, keep the biggest surviving piece, then carefully
              grow it back out until it covers the whole brain and nothing
              else. Checking the box multiplies everything outside that map
              to zero.
            </p>
            <p>
              No meshes, no sculpting, no AI reconstruction: what you see is
              the actual measured MRI data of my head, every fold as the
              scanner recorded it.
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
