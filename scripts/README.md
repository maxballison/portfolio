# scripts/

| Script | What it does |
|---|---|
| `process-assets.sh` | Converts masters in `assets/` into web derivatives in `public/` (audio/image/video compression). |
| `generate-brain-data.mjs` | Copies `assets/brain/brainN/` frames to `public/brain/` and regenerates `app/data/brains.ts` for the brain.exe flipbooks. |
| `build-brain-volume.mjs` | Fuses the `brain2` MRI slices into a 3D volume for the brainvol.exe viewer. Algorithms below. |

## How the 3D brain is built and rendered

The MRI in `public/brain/brain2/` is a *sagittal sweep*: 176 pictures, each one
a thin vertical slice of the head, moving ear to ear in ~1mm steps. Because the
slices are parallel and evenly spaced, stacking them in order recreates the 3D
block of tissue they were cut from, the same way a loaf of bread reassembles
from its slices. Each pixel in each slice becomes a **voxel** (3D pixel) whose
brightness is the MRI signal at that spot in the head.

`build-brain-volume.mjs` does the stacking and cleanup:

1. **Stack the slices.** Read every `image_<n>.png` in numeric order into one
   192 x 256 x N brightness grid (x = front-to-back, y = top-to-bottom,
   z = slice number, i.e. left-to-right).

2. **Fill the gap.** Frame 34 is missing from the export. Its slice is
   reconstructed by averaging frames 33 and 35 pixel-by-pixel; at 1mm spacing,
   neighboring slices are so similar that the average is a faithful stand-in.
   This keeps the z-spacing uniform, which the renderer depends on.

3. **Sanity-check brightness.** If the frames had been exported with
   per-frame auto-brightness, the volume would show stripes. The script
   compares mean tissue brightness across the central slices and warns if the
   spread is large (measured: 7/255, effectively uniform, no correction
   needed).

4. **Find the noise floor (Rayleigh estimate).** Air around the head is not
   black in an MRI; it is faint static. To hide it, we need the brightness
   level that separates static from tissue. The 20x20 corner patches of every
   slice are (almost) always air, and MRI background static follows a known
   statistical shape (a Rayleigh distribution), so its *median* -- which is
   robust even when some corners contain artifacts -- pins down the whole
   distribution: sigma = median / 1.1774, and ~99.9% of static falls below
   3.5 sigma. That value (30/255 here) becomes the default "tissue floor" in
   the viewer.

5. **Trim slices that are pure static.** The first ~9 and last ~8 slices of
   the sweep sit entirely outside the head. They cannot be detected by
   brightness alone (amplifier gain makes their static fairly bright), but
   they can be detected by *structure*: real anatomy has strong local
   contrast, static is flat everywhere. Each slice is cut into 16x16 blocks;
   if the block-to-block variation of mean brightness is below an
   empirically-measured threshold, the slice is dropped from the ends. This
   removed the gray "curtains" at the sides of the 3D render.

6. **Skull-strip a brain mask.** For the viewer's "Brain only" mode, the
   script computes which voxels are brain versus scalp/skull/face, using the
   same ideas as clinical brain-extraction tools:

   - *Threshold and erode.* Keep bright tissue, then shrink the result by
     4mm. In a T1 scan the skull and the fluid around the brain are dark, so
     they form a moat: eroding eats the thin scalp layer entirely and severs
     any thin bright bridges (eye sockets, temporal muscle). What survives is
     a set of disconnected tissue cores.
   - *Largest connected piece.* The biggest surviving core is the cerebrum,
     guaranteed to be scalp-free.
   - *Geodesic regrowth.* Grow the core back out one voxel layer at a time
     (22 layers max), but only into moderately bright tissue -- brighter than
     gray matter's floor, darker than blood and fat. Growth flows through the
     midbrain into the cerebellum and brainstem, but cannot cross the dark
     skull moat to the scalp, cannot pass through bright veins into the
     sinus channels, and the layer budget stops it from snaking down the
     spinal cord.
   - *Shave, close, fill.* A 2.5mm erode/dilate round-trip shaves off thin
     membrane flaps the regrowth picked up near the skull base; a 6mm
     close fills dark internal cavities (the ventricles); finally a flood
     fill from outside marks anything still unreachable as interior and
     fills it (deep veins, enclosed fluid).
   - *Feather.* The hard yes/no mask edge is softened over ~3 voxels into a
     smooth alpha ramp so the rendered brain surface is not stair-stepped.

   The mask ships as a second, much smaller atlas (`brain2-mask-atlas.png`,
   ~0.2MB); in the shader, brain-only mode just multiplies each sample by its
   mask value. Contour overlays in `/tmp/brain-debug/mask_*.png` draw the
   mask boundary in red over the anatomy for verification.

7. **Pack for the web.** Browsers cannot fetch a 3D texture directly, so the
   160 kept slices are tiled into one grayscale PNG (a texture atlas, like a
   contact sheet) plus a small JSON manifest recording the dimensions, tile
   layout, and default brightness window. One ~4.4MB download instead of 160
   requests.

8. **Emit proof images.** The script also writes axial and coronal cuts
   (slices through the volume at 90 degrees to the originals) to
   `/tmp/brain-debug/`. If stacking or ordering were wrong these would look
   scrambled; coherent top-down/front-back anatomy proves the volume is
   geometrically sound.

### Rendering (in the browser)

`app/components/brainVolumeRenderer.ts` draws the volume with **volume ray
casting**, the technique used by medical imaging software:

- The atlas is unpacked back into a real 3D texture on the GPU.
- For every pixel on screen, a ray is fired from the camera through the
  volume's bounding box. The ray takes a few hundred small steps; at each step
  it reads the interpolated voxel brightness.
- **Translucent mode** treats brightness as a semi-transparent glowing
  material (emission-absorption compositing, front to back). The opacity
  slider scales how absorbing the material is -- turn it down and outer layers
  contribute less, letting interior structure show through. Surfaces are shaded
  by estimating the local brightness *gradient* (which way tissue density
  changes fastest); that vector acts as a surface normal for simple diffuse
  lighting, which is what makes the cortical folds read as 3D relief.
- **X-ray mode** just sums absorption along the ray, like film behind a
  radiograph. **Max intensity mode** keeps the single brightest voxel the ray
  crossed (a standard radiology projection, good for bright features).
- The "tissue floor / brightness ceiling" sliders remap which brightness range
  is visible; the "sagittal cut" slider discards samples past a plane so you
  can slice the head open interactively. "Brain only" multiplies every sample
  by the skull-strip mask (loaded as a second 3D texture), and because the
  lighting gradient is computed on the masked field, the exposed brain surface
  shades correctly instead of looking like a flat cutout.
- Each ray's start position is jittered by a per-pixel pseudo-random amount to
  turn stair-step banding into imperceptible noise.

Full rebuild: `node scripts/build-brain-volume.mjs` (safe to re-run any time;
outputs in `public/brain/volume/` are fully derived, never hand-edited).
