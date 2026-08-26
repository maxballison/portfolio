# Max Allison - Portfolio

Personal site styled as a Windows-9x desktop: silver windows on a teal
desktop, a working Winamp-style music player (MAXAMP), and real MRI scans of
my actual brain, including an interactive 3D reconstruction of it.

Built with Next.js (App Router), TypeScript, Tailwind v4, and
[98.css](https://jdan.github.io/98.css/) for the Win98 chrome.

## Highlights

- **MAXAMP** - Winamp-style player with an LCD readout, live spectrum
  analyzer (Web Audio API), seek/transport/volume, and a playlist window that
  loads tracks into the deck.
- **brain.exe** - my real MRI scans played back as looping flipbooks.
- **brainvol.exe** - the headline act: the 176 sagittal MRI slices fused back
  into a true 3D volume and raymarched live on the GPU in raw WebGL2 (no
  three.js). Rotate it, see through the skull by lowering opacity, slice it
  open with a clipping plane, or flip on **Brain only** to skull-strip the
  scan and look at just the brain, folds and all. Click the ? in its title
  bar for a plain-language explanation of how it works.

## How the 3D brain works (short version)

I got an MRI and they gave me a stack of slice images. The build script
(`scripts/build-brain-volume.mjs`) stacks them into a voxel grid, repairs a
missing slice by averaging its neighbors, measures the scanner's noise floor
(Rayleigh statistics on the always-air corner patches), trims the
noise-only slices at each end, and computes a skull-stripped brain mask with
3D morphology: threshold, erode until the dark skull gap severs brain from
scalp, keep the largest connected component, geodesically regrow it into the
cerebellum and brainstem, then close, shave, and hole-fill. Volume and mask
ship as tiled PNG atlases plus a JSON manifest.

In the browser, a fragment shader casts a ray per pixel through a 3D texture
and integrates emission-absorption (with gradient-based shading, per-pixel
jitter, and translucent / X-ray / max-intensity modes). Brain-only mode
multiplies each sample by the mask. The full algorithm walkthrough lives in
[`scripts/README.md`](scripts/README.md).

## Development

```bash
npm run dev     # dev server on :3000
npm run lint
npm run build   # must pass before shipping
```

Content pipelines (masters in `assets/`, gitignored; web derivatives in
`public/`):

```bash
scripts/process-assets.sh              # audio/image/video conversion
node scripts/generate-brain-data.mjs   # brain scan frames -> flipbook data
node scripts/build-brain-volume.mjs    # brain2 slices -> 3D volume + brain mask
```

See `CLAUDE.md` for the full project map, conventions, and playbooks.
