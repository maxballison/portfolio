// Builds a 3D voxel volume from the brain2 sagittal MRI slice PNGs.
//
//   node scripts/build-brain-volume.mjs
//
// Reads  public/brain/brain2/image_<n>.png  (sagittal sweep, one PNG per slice)
// Writes public/brain/volume/brain2-atlas.png   8-bit grayscale texture atlas,
//                                               slices tiled in a grid
//        public/brain/volume/brain2-volume.json manifest (dims, atlas layout,
//                                               intensity window defaults)
//        /tmp/brain-debug/*.png                 reconstructed axial + coronal
//                                               cuts for visual verification
//
// The missing slice (image_34) is filled by averaging its neighbors so the
// slice spacing stays uniform. Per-slice mean intensities are reported to
// detect any per-frame brightness drift from the original export.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "public/brain/brain2");
const outDir = join(root, "public/brain/volume");
const debugDir = "/tmp/brain-debug";
mkdirSync(outDir, { recursive: true });
mkdirSync(debugDir, { recursive: true });

// ---- load slices ----------------------------------------------------------

const nums = readdirSync(srcDir)
  .map((f) => /^image_(\d+)\.png$/.exec(f))
  .filter(Boolean)
  .map((m) => Number(m[1]))
  .sort((a, b) => a - b);

const first = nums[0];
const last = nums[nums.length - 1];
console.log(`found ${nums.length} slices, numbered ${first}..${last}`);

const have = new Set(nums);
const missing = [];
for (let n = first; n <= last; n++) if (!have.has(n)) missing.push(n);
if (missing.length) console.log(`missing (will interpolate): ${missing.join(", ")}`);

/** Decode a PNG to a Uint8Array of luminance values. */
function loadGray(path) {
  const png = PNG.sync.read(readFileSync(path));
  const { width, height, data } = png; // data is always RGBA
  const gray = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    // MRI frames are effectively grayscale; take max of RGB to be safe.
    const o = i * 4;
    gray[i] = Math.max(data[o], data[o + 1], data[o + 2]);
  }
  return { width, height, gray };
}

const probe = loadGray(join(srcDir, `image_${first}.png`));
const W = probe.width; // in-plane x: anterior-posterior
const H = probe.height; // in-plane y: superior-inferior (row 0 = top of head)
const D = last - first + 1; // slice axis: left-right sweep
console.log(`volume dims: ${W} x ${H} x ${D} (w x h x slices)`);

const slices = new Array(D).fill(null);
for (const n of nums) {
  const { width, height, gray } = loadGray(join(srcDir, `image_${n}.png`));
  if (width !== W || height !== H) throw new Error(`size mismatch in image_${n}.png`);
  slices[n - first] = gray;
}
for (const n of missing) {
  const a = slices[n - first - 1];
  const b = slices[n - first + 1];
  if (!a || !b) throw new Error(`cannot interpolate slice ${n}: neighbor missing`);
  const mid = new Uint8Array(W * H);
  for (let i = 0; i < mid.length; i++) mid[i] = (a[i] + b[i]) >> 1;
  slices[n - first] = mid;
}

// ---- per-slice brightness sanity check ------------------------------------

const means = slices.map((s) => {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] > 24) {
      sum += s[i];
      count++;
    }
  }
  return count ? sum / count : 0;
});
const mid = means.slice(Math.floor(D * 0.3), Math.floor(D * 0.7)); // central slices, most tissue
const avg = mid.reduce((a, b) => a + b, 0) / mid.length;
const spread = Math.max(...mid) - Math.min(...mid);
console.log(
  `per-slice mean intensity (central 40%): avg ${avg.toFixed(1)}, spread ${spread.toFixed(1)} ` +
    (spread > 30 ? "-- WARNING: brightness drift, consider normalizing" : "(consistent)")
);

// ---- intensity histogram for default window -------------------------------

const hist = new Array(256).fill(0);
let nonzero = 0;
for (const s of slices)
  for (let i = 0; i < s.length; i++)
    if (s[i] > 4) {
      hist[s[i]]++;
      nonzero++;
    }
const percentile = (p) => {
  let acc = 0;
  const target = nonzero * p;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= target) return v;
  }
  return 255;
};
const p02 = percentile(0.02);
const p98 = percentile(0.98);
console.log(`intensity percentiles: p2=${p02} p98=${p98}`);

// Estimate the air-noise level from the slice corners (air in a head scan,
// though edge slices can carry wraparound artifacts). MRI background noise is
// Rayleigh-distributed; the median is robust to artifact contamination:
// sigma = median / 1.1774, and ~99.9% of noise sits below 3.5 sigma. Default
// the intensity window's low end there so air does not render as fog.
const corner = 20;
const cornerVals = [];
for (const s of slices) {
  for (const [cx, cy] of [[0, 0], [W - corner, 0], [0, H - corner], [W - corner, H - corner]]) {
    for (let y = cy; y < cy + corner; y++)
      for (let x = cx; x < cx + corner; x++) cornerVals.push(s[y * W + x]);
  }
}
cornerVals.sort((a, b) => a - b);
const noiseMedian = cornerVals[Math.floor(cornerVals.length / 2)];
const noiseSigma = noiseMedian / 1.1774;
const windowLow = Math.max(p02, Math.round(noiseSigma * 3.5));
console.log(`air noise: median ${noiseMedian}, sigma ${noiseSigma.toFixed(1)} -> window low ${windowLow}`);

// ---- trim pure-noise edge slices -------------------------------------------
// The first/last slices of the sweep sit outside the head: air noise plus a
// coil-sensitivity gradient that is uniformly brighter than the window floor,
// so it renders as gray curtains at the volume edges. Discriminate by
// structure instead of brightness: anatomy has strong local contrast (std of
// 16x16 block means is 22-40 on this data), noise-only slices are flat
// (10-16). Threshold at 17, measured empirically on this dataset.

function blockContrast(s) {
  const B = 16;
  const means = [];
  for (let by = 0; by + B <= H; by += B)
    for (let bx = 0; bx + B <= W; bx += B) {
      let sum = 0;
      for (let y = by; y < by + B; y++)
        for (let x = bx; x < bx + B; x++) sum += s[y * W + x];
      means.push(sum / (B * B));
    }
  const m = means.reduce((a, b) => a + b, 0) / means.length;
  return Math.sqrt(means.reduce((a, b) => a + (b - m) * (b - m), 0) / means.length);
}

let lo = 0;
let hi = slices.length - 1;
while (lo < hi && blockContrast(slices[lo]) < 17) lo++;
while (hi > lo && blockContrast(slices[hi]) < 17) hi--;
if (lo > 0 || hi < slices.length - 1) {
  console.log(
    `trimming noise-only slices: ${lo} leading, ${slices.length - 1 - hi} trailing ` +
      `(kept ${hi - lo + 1} of ${slices.length})`
  );
  slices.splice(hi + 1);
  slices.splice(0, lo);
}
const DK = slices.length; // kept depth

// ---- skull strip: compute a 3D brain mask ----------------------------------
// Morphological brain extraction with geodesic reconstruction:
//  1. threshold at CORE_T and erode hard (ERODE_R): the skull + CSF are dark
//     in T1, so this strips scalp and severs every thin bright bridge,
//     leaving disconnected tissue cores
//  2. largest connected component: the cerebrum core, guaranteed scalp-free
//  3. geodesic reconstruction: regrow the core one voxel at a time, but only
//     into tissue brighter than COND_T and only RECON_ITERS steps. Growth
//     flows through the midbrain into the cerebellum and brainstem (bright,
//     nearby) but cannot cross the dark skull gap to the scalp, and the step
//     budget stops it before it can snake down the spinal cord to the neck
//  4. closing by CLOSE_R fills dark interior cavities (ventricles, sulci)
//  5. feather the edge over ~1.5 voxels so the rendered cut is smooth
// Distances use a 3-4-5 chamfer transform (3 units = 1 voxel = ~1mm).

const CORE_T = 55; // core threshold: bright tissue only
const COND_T = 50; // growth floor: what reconstruction may claim
const VEIN_T = 150; // growth ceiling: blood/fat are brighter than GM/WM, so
                    // capping stops growth crossing veins into the sinuses
const ERODE_R = 4; // mm; guarantees the core excludes scalp
const RECON_ITERS = 22; // max regrowth distance in voxels (~mm)
const CLOSE_R = 6; // mm; must exceed ventricle width to fill them

const NVOX = W * H * DK;
const vol = new Uint8Array(NVOX);
for (let z = 0; z < DK; z++) vol.set(slices[z], z * W * H);
const vi = (x, y, z) => (z * H + y) * W + x;

/** 3-4-5 chamfer distance to the nearest zero voxel, in chamfer units. */
function chamferDT(mask) {
  const INF = 0x3fffffff;
  const dt = new Int32Array(NVOX);
  for (let i = 0; i < NVOX; i++) dt[i] = mask[i] ? INF : 0;
  const pass = (reverse) => {
    for (let zi = 0; zi < DK; zi++) {
      const z = reverse ? DK - 1 - zi : zi;
      for (let yi = 0; yi < H; yi++) {
        const y = reverse ? H - 1 - yi : yi;
        for (let xi = 0; xi < W; xi++) {
          const x = reverse ? W - 1 - xi : xi;
          let d = dt[vi(x, y, z)];
          if (d === 0) continue;
          // neighbors already visited in this pass direction
          for (let dz = -1; dz <= 1; dz++)
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++) {
                const order = dz !== 0 ? dz : dy !== 0 ? dy : dx;
                if (order === 0 || (reverse ? order < 0 : order > 0)) continue;
                const nx = x + dx, ny = y + dy, nz = z + dz;
                if (nx < 0 || nx >= W || ny < 0 || ny >= H || nz < 0 || nz >= DK) continue;
                const wgt = 2 + Math.abs(dx) + Math.abs(dy) + Math.abs(dz); // 3/4/5
                const cand = dt[vi(nx, ny, nz)] + wgt;
                if (cand < d) d = cand;
              }
          dt[vi(x, y, z)] = d;
        }
      }
    }
  };
  pass(false);
  pass(true);
  return dt;
}

const erode = (mask, r) => {
  const dt = chamferDT(mask);
  const out = new Uint8Array(NVOX);
  const lim = r * 3;
  for (let i = 0; i < NVOX; i++) out[i] = dt[i] > lim ? 1 : 0;
  return out;
};

const dilate = (mask, r) => {
  const inv = new Uint8Array(NVOX);
  for (let i = 0; i < NVOX; i++) inv[i] = mask[i] ? 0 : 1;
  const dt = chamferDT(inv);
  const out = new Uint8Array(NVOX);
  const lim = r * 3;
  for (let i = 0; i < NVOX; i++) out[i] = mask[i] || dt[i] <= lim ? 1 : 0;
  return out;
};

/** Largest 6-connected component of a binary mask. */
function largestComponent(mask) {
  const label = new Int32Array(NVOX); // 0 = unvisited
  const queue = new Int32Array(NVOX);
  let best = { id: 0, size: 0 };
  let nextId = 0;
  for (let seed = 0; seed < NVOX; seed++) {
    if (!mask[seed] || label[seed]) continue;
    const id = ++nextId;
    let head = 0, tail = 0, size = 0;
    queue[tail++] = seed;
    label[seed] = id;
    while (head < tail) {
      const i = queue[head++];
      size++;
      const x = i % W, y = ((i / W) | 0) % H, z = (i / (W * H)) | 0;
      if (x > 0 && mask[i - 1] && !label[i - 1]) { label[i - 1] = id; queue[tail++] = i - 1; }
      if (x < W - 1 && mask[i + 1] && !label[i + 1]) { label[i + 1] = id; queue[tail++] = i + 1; }
      if (y > 0 && mask[i - W] && !label[i - W]) { label[i - W] = id; queue[tail++] = i - W; }
      if (y < H - 1 && mask[i + W] && !label[i + W]) { label[i + W] = id; queue[tail++] = i + W; }
      if (z > 0 && mask[i - W * H] && !label[i - W * H]) { label[i - W * H] = id; queue[tail++] = i - W * H; }
      if (z < DK - 1 && mask[i + W * H] && !label[i + W * H]) { label[i + W * H] = id; queue[tail++] = i + W * H; }
    }
    if (size > best.size) best = { id, size };
  }
  const out = new Uint8Array(NVOX);
  for (let i = 0; i < NVOX; i++) out[i] = label[i] === best.id ? 1 : 0;
  console.log(`largest component: ${best.size} voxels (${((best.size / NVOX) * 100).toFixed(1)}% of volume)`);
  return out;
}

console.log("skull strip: threshold + erode...");
let mask = new Uint8Array(NVOX);
for (let i = 0; i < NVOX; i++) mask[i] = vol[i] > CORE_T ? 1 : 0;
mask = erode(mask, ERODE_R);
console.log("skull strip: largest component...");
mask = largestComponent(mask);

// geodesic reconstruction: multi-source BFS from the core, 6-connected,
// claiming voxels brighter than COND_T, at most RECON_ITERS layers
console.log("skull strip: geodesic reconstruction...");
{
  const cond = new Uint8Array(NVOX);
  for (let i = 0; i < NVOX; i++) cond[i] = vol[i] > COND_T && vol[i] < VEIN_T ? 1 : 0;
  const depth = new Int32Array(NVOX).fill(-1);
  const queue = new Int32Array(NVOX);
  let head = 0, tail = 0;
  for (let i = 0; i < NVOX; i++)
    if (mask[i]) {
      depth[i] = 0;
      queue[tail++] = i;
    }
  let grown = 0;
  while (head < tail) {
    const i = queue[head++];
    const d = depth[i];
    if (d >= RECON_ITERS) continue;
    const x = i % W, y = ((i / W) | 0) % H, z = (i / (W * H)) | 0;
    for (const [nx, ny, nz] of [[x - 1, y, z], [x + 1, y, z], [x, y - 1, z], [x, y + 1, z], [x, y, z - 1], [x, y, z + 1]]) {
      if (nx < 0 || nx >= W || ny < 0 || ny >= H || nz < 0 || nz >= DK) continue;
      const ni = vi(nx, ny, nz);
      if (depth[ni] !== -1 || !cond[ni]) continue;
      depth[ni] = d + 1;
      mask[ni] = 1;
      grown++;
      queue[tail++] = ni;
    }
  }
  console.log(`reconstruction grew ${grown} voxels (mask now ${mask.reduce((a, b) => a + b, 0)})`);
}

// opening: shave off thin flaps (dura/sinus slivers picked up by the
// reconstruction near the skull base) while they are still thin -- must run
// BEFORE closing, which would thicken them past shaving
console.log("skull strip: shave flaps...");
mask = erode(mask, 2.5);
mask = largestComponent(mask);
mask = dilate(mask, 2.5);

console.log("skull strip: close...");
mask = erode(dilate(mask, CLOSE_R), CLOSE_R);

// fill enclosed holes of any shape (interior veins excluded by VEIN_T, deep
// CSF): flood the background from the volume border; whatever the flood
// cannot reach is inside the brain envelope and belongs to the mask
console.log("skull strip: fill holes...");
{
  const reached = new Uint8Array(NVOX);
  const queue = new Int32Array(NVOX);
  let head = 0, tail = 0;
  const push = (i) => {
    if (!reached[i] && !mask[i]) {
      reached[i] = 1;
      queue[tail++] = i;
    }
  };
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      push(vi(x, y, 0));
      push(vi(x, y, DK - 1));
    }
  for (let z = 0; z < DK; z++)
    for (let x = 0; x < W; x++) {
      push(vi(x, 0, z));
      push(vi(x, H - 1, z));
    }
  for (let z = 0; z < DK; z++)
    for (let y = 0; y < H; y++) {
      push(vi(0, y, z));
      push(vi(W - 1, y, z));
    }
  while (head < tail) {
    const i = queue[head++];
    const x = i % W, y = ((i / W) | 0) % H, z = (i / (W * H)) | 0;
    if (x > 0) push(i - 1);
    if (x < W - 1) push(i + 1);
    if (y > 0) push(i - W);
    if (y < H - 1) push(i + W);
    if (z > 0) push(i - W * H);
    if (z < DK - 1) push(i + W * H);
  }
  let filled = 0;
  for (let i = 0; i < NVOX; i++)
    if (!mask[i] && !reached[i]) {
      mask[i] = 1;
      filled++;
    }
  console.log(`filled ${filled} enclosed hole voxels`);
}

// feathered alpha: ramp over +-1.5 voxels around the mask edge
console.log("skull strip: feather...");
const alpha = new Uint8Array(NVOX);
{
  const dtIn = chamferDT(mask);
  const inv = new Uint8Array(NVOX);
  for (let i = 0; i < NVOX; i++) inv[i] = mask[i] ? 0 : 1;
  const dtOut = chamferDT(inv);
  for (let i = 0; i < NVOX; i++) {
    const signed = mask[i] ? dtIn[i] : -dtOut[i]; // chamfer units, + inside
    const a = (signed + 4.5) / 9; // -1.5..+1.5 voxels -> 0..1
    alpha[i] = Math.round(Math.min(Math.max(a, 0), 1) * 255);
  }
}

// ---- pack atlas ------------------------------------------------------------

const cols = Math.ceil(Math.sqrt((DK * H) / W)); // aim for a roughly square atlas
const rows = Math.ceil(DK / cols);
const atlasW = cols * W;
const atlasH = rows * H;
console.log(`atlas: ${cols} x ${rows} tiles -> ${atlasW} x ${atlasH} px`);
if (atlasW > 4096 || atlasH > 4096)
  console.warn("WARNING: atlas exceeds 4096px, may fail on low-end GPUs");

const atlas = new PNG({ width: atlasW, height: atlasH });
for (let z = 0; z < DK; z++) {
  const tx = (z % cols) * W;
  const ty = Math.floor(z / cols) * H;
  const s = slices[z];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = ((ty + y) * atlasW + tx + x) * 4;
      const v = s[y * W + x];
      atlas.data[o] = v;
      atlas.data[o + 1] = v;
      atlas.data[o + 2] = v;
      atlas.data[o + 3] = 255;
    }
  }
}
const atlasPath = join(outDir, "brain2-atlas.png");
const atlasBuf = PNG.sync.write(atlas, { colorType: 0 }); // encode as 8-bit grayscale
writeFileSync(atlasPath, atlasBuf);
console.log(`wrote ${atlasPath} (${(atlasBuf.length / 1e6).toFixed(1)} MB)`);

// mask atlas: same tiling, feathered brain-mask alpha instead of intensity
const maskAtlas = new PNG({ width: atlasW, height: atlasH });
for (let z = 0; z < DK; z++) {
  const tx = (z % cols) * W;
  const ty = Math.floor(z / cols) * H;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = ((ty + y) * atlasW + tx + x) * 4;
      const v = alpha[vi(x, y, z)];
      maskAtlas.data[o] = v;
      maskAtlas.data[o + 1] = v;
      maskAtlas.data[o + 2] = v;
      maskAtlas.data[o + 3] = 255;
    }
  }
}
const maskPath = join(outDir, "brain2-mask-atlas.png");
const maskBuf = PNG.sync.write(maskAtlas, { colorType: 0 });
writeFileSync(maskPath, maskBuf);
console.log(`wrote ${maskPath} (${(maskBuf.length / 1e6).toFixed(1)} MB)`);

const manifest = {
  // voxel grid: x = in-plane width (A-P), y = in-plane height (S-I, row 0 at
  // top of head), z = slice index (sagittal sweep across the head)
  width: W,
  height: H,
  depth: DK,
  cols,
  rows,
  atlas: "/brain/volume/brain2-atlas.png",
  maskAtlas: "/brain/volume/brain2-mask-atlas.png",
  // assumed ~1mm isotropic MPRAGE; box aspect for rendering
  spacing: [1, 1, 1],
  window: { low: windowLow, high: p98 },
  interpolatedSlices: missing,
};
writeFileSync(join(outDir, "brain2-volume.json"), JSON.stringify(manifest, null, 2));
console.log(`wrote ${join(outDir, "brain2-volume.json")}`);

// ---- debug reconstructions -------------------------------------------------
// Cut the stacked volume along the other two axes. If slice order/alignment is
// correct these look like coherent axial and coronal MRI slices.

function writeGrayPng(path, width, height, get) {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const v = get(x, y);
      png.data[o] = v;
      png.data[o + 1] = v;
      png.data[o + 2] = v;
      png.data[o + 3] = 255;
    }
  writeFileSync(path, PNG.sync.write(png, { colorType: 0 }));
}

// axial cut at image row r: width = A-P (W), height = slice axis (DK)
for (const frac of [0.35, 0.5, 0.65]) {
  const r = Math.floor(H * frac);
  writeGrayPng(join(debugDir, `axial_row${r}.png`), W, DK, (x, z) => slices[z][r * W + x]);
}
// coronal cut at image column c: width = slice axis (DK), height = S-I (H)
for (const frac of [0.4, 0.5, 0.6]) {
  const c = Math.floor(W * frac);
  writeGrayPng(join(debugDir, `coronal_col${c}.png`), DK, H, (z, y) => slices[z][y * W + c]);
}
// mask contour overlays: anatomy in gray, brain-mask boundary in red. These
// are the ground truth check that the strip neither cuts cortex nor keeps skull.
function writeContourPng(path, width, height, getVal, getMask) {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const inside = getMask(x, y) >= 128;
      let edge = false;
      if (inside) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height || getMask(nx, ny) < 128) {
            edge = true;
            break;
          }
        }
      }
      const v = getVal(x, y);
      png.data[o] = edge ? 255 : v;
      png.data[o + 1] = edge ? 0 : v;
      png.data[o + 2] = edge ? 0 : v;
      png.data[o + 3] = 255;
    }
  writeFileSync(path, PNG.sync.write(png));
}

for (const frac of [0.3, 0.5, 0.7]) {
  const z = Math.floor(DK * frac);
  writeContourPng(join(debugDir, `mask_sag_z${z}.png`), W, H,
    (x, y) => vol[vi(x, y, z)], (x, y) => alpha[vi(x, y, z)]);
  const r = Math.floor(H * frac);
  writeContourPng(join(debugDir, `mask_axial_row${r}.png`), W, DK,
    (x, zz) => vol[vi(x, r, zz)], (x, zz) => alpha[vi(x, r, zz)]);
  const c = Math.floor(W * frac);
  writeContourPng(join(debugDir, `mask_cor_col${c}.png`), DK, H,
    (zz, y) => vol[vi(c, y, zz)], (zz, y) => alpha[vi(c, y, zz)]);
}
console.log(`wrote debug cuts to ${debugDir}`);
