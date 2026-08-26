/**
 * WebGL2 volume raymarcher for the MRI brain volume.
 *
 * The volume (built by scripts/build-brain-volume.mjs) is uploaded as a
 * single-channel 3D texture. Each frame draws one fullscreen triangle; the
 * fragment shader casts a ray per pixel, intersects the volume's bounding
 * box, and integrates emission-absorption along the ray. Three modes:
 *   0 translucent - front-to-back compositing with gradient (surface) shading;
 *                   this is the "see the folds" mode
 *   1 x-ray       - pure accumulated absorption, like a radiograph
 *   2 mip         - maximum intensity projection
 *
 * Axis mapping (see build script): texture s = image column (anterior at 0),
 * t = image row (top of head at 0), p = sagittal slice index (left-right).
 * World space: x = A-P, y = S-I (up), z = L-R, box centered on the origin
 * and scaled by voxel dimensions so proportions are anatomical.
 */

export type VolumeManifest = {
  width: number;
  height: number;
  depth: number;
  cols: number;
  rows: number;
  atlas: string;
  maskAtlas: string;
  spacing: [number, number, number];
  window: { low: number; high: number };
};

export type RenderParams = {
  /** 0..1, mapped to an exponential extinction coefficient */
  density: number;
  /** intensity window, 0..1 of the 8-bit range */
  low: number;
  high: number;
  mode: 0 | 1 | 2;
  /** raymarch steps */
  steps: number;
  /** sagittal clip: fraction of slices kept, 1 = whole head */
  clip: number;
  /** hide everything outside the skull-strip brain mask */
  brainOnly: boolean;
};

const VERT = `#version 300 es
const vec2 POS[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
out vec2 vNdc;
void main() {
  vNdc = POS[gl_VertexID];
  gl_Position = vec4(POS[gl_VertexID], 0., 1.);
}`;

const FRAG = `#version 300 es
precision highp float;
precision highp sampler3D;

uniform sampler3D uVol;
uniform sampler3D uMask;
uniform float uBrainOnly; // 0 or 1: multiply by the skull-strip mask
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
uniform float uTanHalfFov;
uniform float uAspect;
uniform vec3 uHalf;      // box half-extents
uniform float uSigma;    // extinction coefficient
uniform float uLow;
uniform float uHigh;
uniform int uMode;       // 0 translucent, 1 xray, 2 mip
uniform int uSteps;
uniform float uClip;     // keep texture p <= uClip

in vec2 vNdc;
out vec4 outColor;

const int MAX_STEPS = 512;

vec2 boxHit(vec3 ro, vec3 rd) {
  vec3 inv = 1.0 / rd;
  vec3 t0 = (-uHalf - ro) * inv;
  vec3 t1 = ( uHalf - ro) * inv;
  vec3 lo = min(t0, t1);
  vec3 hi = max(t0, t1);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}

vec3 toTex(vec3 p) {
  vec3 t = p / (2.0 * uHalf) + 0.5;
  t.y = 1.0 - t.y; // image row 0 is the top of the head
  return t;
}

float win(float v) {
  return clamp((v - uLow) / (uHigh - uLow), 0.0, 1.0);
}

float density(vec3 tc) {
  float m = mix(1.0, texture(uMask, tc).r, uBrainOnly);
  return win(texture(uVol, tc).r) * m;
}

vec3 gradient(vec3 p, float eps) {
  vec2 e = vec2(eps, 0.0);
  return vec3(
    density(toTex(p + e.xyy)) - density(toTex(p - e.xyy)),
    density(toTex(p + e.yxy)) - density(toTex(p - e.yxy)),
    density(toTex(p + e.yyx)) - density(toTex(p - e.yyx)));
}

void main() {
  vec3 rd = normalize(uCamFwd
    + vNdc.x * uTanHalfFov * uAspect * uCamRight
    + vNdc.y * uTanHalfFov * uCamUp);
  vec3 ro = uCamPos;

  vec2 hit = boxHit(ro, rd);
  if (hit.x >= hit.y || hit.y < 0.0) {
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }
  float t = max(hit.x, 0.0);
  float dt = (hit.y - t) / float(uSteps);
  // per-pixel jitter hides step banding
  t += dt * fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);

  if (uMode == 2) { // MIP
    float m = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      if (i >= uSteps) break;
      vec3 tc = toTex(ro + rd * t);
      if (tc.z <= uClip) m = max(m, density(tc));
      t += dt;
    }
    outColor = vec4(vec3(m), 1.0);
    return;
  }

  if (uMode == 1) { // X-ray
    float sum = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      if (i >= uSteps) break;
      vec3 tc = toTex(ro + rd * t);
      if (tc.z <= uClip) sum += density(tc) * dt * uSigma * 0.14;
      t += dt;
    }
    float v = 1.0 - exp(-sum);
    outColor = vec4(vec3(v), 1.0);
    return;
  }

  // translucent, gradient-shaded
  vec3 acc = vec3(0.0);
  float T = 1.0;
  vec3 L = normalize(-rd + uCamUp * 0.6 + uCamRight * 0.3); // headlight, slightly off-axis
  float eps = uHalf.y / 128.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * t;
    vec3 tc = toTex(p);
    if (tc.z <= uClip) {
      float w = density(tc);
      if (w > 0.01) {
        float a = 1.0 - exp(-pow(w, 1.6) * uSigma * dt);
        vec3 g = gradient(p, eps);
        float gl2 = length(g);
        // surface shading where the gradient is strong (tissue boundaries,
        // i.e. the folds), flat where it is weak (homogeneous interior)
        float diff = 1.0;
        if (gl2 > 1e-4) {
          vec3 N = -g / gl2;
          diff = mix(1.0, 0.35 + 0.85 * max(dot(N, L), 0.0), min(gl2 * 6.0, 1.0));
        }
        acc += T * a * vec3(w) * diff;
        T *= 1.0 - a;
        if (T < 0.01) break;
      }
    }
    t += dt;
  }
  outColor = vec4(acc, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`shader compile failed: ${log}`);
  }
  return sh;
}

export class VolumeRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private texture: WebGLTexture | null = null;
  private maskTexture: WebGLTexture | null = null;
  private vao: WebGLVertexArrayObject;
  private half: [number, number, number] = [0.5, 0.5, 0.5];

  // orbit camera: 3/4 side view from slightly above, folds visible through
  // the crown (pose chosen from software-rendered previews)
  theta = -0.45; // azimuth
  phi = 0.42; // elevation
  dist = 2.4;

  params: RenderParams = {
    density: 0.5,
    low: 0.02,
    high: 0.57,
    mode: 0,
    steps: 160,
    clip: 1,
    brainOnly: false,
  };

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("webgl2-unsupported");
    this.gl = gl;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`program link failed: ${gl.getProgramInfoLog(program)}`);
    }
    this.program = program;
    for (const name of [
      "uVol", "uMask", "uBrainOnly", "uCamPos", "uCamRight", "uCamUp", "uCamFwd", "uTanHalfFov",
      "uAspect", "uHalf", "uSigma", "uLow", "uHigh", "uMode", "uSteps", "uClip",
    ]) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    this.vao = gl.createVertexArray()!;
  }

  private uploadR8(data: Uint8Array, w: number, h: number, d: number): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_3D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texStorage3D(gl.TEXTURE_3D, 1, gl.R8, w, h, d);
    gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, w, h, d, gl.RED, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    return tex;
  }

  /** Upload the voxel grid as a single-channel 3D texture. */
  setVolume(data: Uint8Array, w: number, h: number, d: number, spacing: [number, number, number]) {
    if (this.texture) this.gl.deleteTexture(this.texture);
    this.texture = this.uploadR8(data, w, h, d);

    // physical box proportions, normalized so the longest edge = 1
    const dims = [w * spacing[0], h * spacing[1], d * spacing[2]];
    const max = Math.max(...dims);
    this.half = [dims[0] / max / 2, dims[1] / max / 2, dims[2] / max / 2];
  }

  /** Upload the skull-strip brain mask (same grid) for brain-only mode. */
  setMask(data: Uint8Array, w: number, h: number, d: number) {
    if (this.maskTexture) this.gl.deleteTexture(this.maskTexture);
    this.maskTexture = this.uploadR8(data, w, h, d);
  }

  rotate(dx: number, dy: number) {
    this.theta -= dx * 0.008;
    this.phi = Math.min(1.45, Math.max(-1.45, this.phi + dy * 0.008));
  }

  zoom(factor: number) {
    this.dist = Math.min(5, Math.max(1.1, this.dist * factor));
  }

  resetView() {
    this.theta = -0.45;
    this.phi = 0.42;
    this.dist = 2.4;
  }

  render() {
    const gl = this.gl;
    if (!this.texture) return;
    const { width, height } = gl.canvas;
    gl.viewport(0, 0, width, height);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // orbit camera around the origin
    const cp = Math.cos(this.phi);
    const eye = [
      this.dist * cp * Math.sin(this.theta),
      this.dist * Math.sin(this.phi),
      this.dist * cp * Math.cos(this.theta),
    ];
    const fwd = norm([-eye[0], -eye[1], -eye[2]]);
    const right = norm(cross(fwd, [0, 1, 0]));
    const up = cross(right, fwd);

    const u = this.uniforms;
    const p = this.params;
    gl.uniform3fv(u.uCamPos, eye);
    gl.uniform3fv(u.uCamRight, right);
    gl.uniform3fv(u.uCamUp, up);
    gl.uniform3fv(u.uCamFwd, fwd);
    gl.uniform1f(u.uTanHalfFov, Math.tan((30 * Math.PI) / 360));
    gl.uniform1f(u.uAspect, width / height);
    gl.uniform3fv(u.uHalf, this.half);
    // density slider 0..1 -> extinction coefficient 10..1000 (exponential)
    gl.uniform1f(u.uSigma, Math.pow(10, 1 + 2 * p.density));
    gl.uniform1f(u.uLow, p.low);
    gl.uniform1f(u.uHigh, Math.max(p.high, p.low + 0.02));
    gl.uniform1i(u.uMode, p.mode);
    gl.uniform1i(u.uSteps, p.steps);
    gl.uniform1f(u.uClip, p.clip);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_3D, this.texture);
    gl.uniform1i(u.uVol, 0);
    // mask on unit 1; fall back to the volume texture (unused when
    // uBrainOnly is 0) so the sampler is never unbound
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_3D, this.maskTexture ?? this.texture);
    gl.uniform1i(u.uMask, 1);
    gl.uniform1f(u.uBrainOnly, p.brainOnly && this.maskTexture ? 1 : 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    const gl = this.gl;
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.maskTexture) gl.deleteTexture(this.maskTexture);
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

function norm(v: number[]): number[] {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function cross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/**
 * Fetch an atlas PNG (volume or mask), decode it, and unpack the tiles into a
 * contiguous voxel array (one byte per voxel, x fastest, then y, then slice).
 */
export async function loadVolume(
  manifest: VolumeManifest,
  onProgress?: (frac: number) => void,
  url: string = manifest.atlas
): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`atlas fetch failed: ${res.status}`);
  const total = Number(res.headers.get("Content-Length")) || 0;
  const reader = res.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value as Uint8Array<ArrayBuffer>);
    loaded += value.length;
    if (total > 0) onProgress?.(Math.min(loaded / total, 1));
  }
  const blob = new Blob(chunks as BlobPart[]);
  const bitmap = await createImageBitmap(blob);

  const { width: W, height: H, depth: D, cols } = manifest;
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const atlas = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const atlasW = canvas.width;

  const vol = new Uint8Array(W * H * D);
  for (let z = 0; z < D; z++) {
    const tx = (z % cols) * W;
    const ty = Math.floor(z / cols) * H;
    for (let y = 0; y < H; y++) {
      const src = ((ty + y) * atlasW + tx) * 4;
      const dst = (z * H + y) * W;
      for (let x = 0; x < W; x++) vol[dst + x] = atlas[src + x * 4];
    }
  }
  canvas.width = canvas.height = 0; // release the decode surface eagerly
  return vol;
}
