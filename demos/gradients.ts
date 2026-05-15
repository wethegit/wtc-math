import { Vec4 } from '../src/index';

// Colour conversion helpers

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// sRGB Vec4 -> [L, a, b] in Oklab
function vec4ToOklab(v: Vec4): [number, number, number] {
  const r = srgbToLinear(v.x);
  const g = srgbToLinear(v.y);
  const b = srgbToLinear(v.z);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

// [L, a, b] Oklab -> sRGB Vec4
function oklabToVec4(L: number, a: number, b: number, alpha: number): Vec4 {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const linR =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const linG = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const linB = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return new Vec4(
    clamp01(linearToSrgb(Math.max(0, linR))),
    clamp01(linearToSrgb(Math.max(0, linG))),
    clamp01(linearToSrgb(Math.max(0, linB))),
    alpha,
  );
}

// sRGB Vec4 -> [L, C, H] in Oklch
function vec4ToOklch(v: Vec4): [number, number, number] {
  const [L, a, b] = vec4ToOklab(v);
  return [L, Math.sqrt(a * a + b * b), Math.atan2(b, a)];
}

// Lerp hue angle via shortest arc
function lerpHue(a: number, b: number, t: number): number {
  let diff = b - a;
  if (diff > Math.PI)  diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  return a + diff * t;
}

// Interpolation functions

function lerpSrgb(a: Vec4, b: Vec4, t: number): Vec4 {
  return Vec4.lerp(a, b, t) as Vec4;
}

function lerpLinearLight(a: Vec4, b: Vec4, t: number): Vec4 {
  const aL = new Vec4(srgbToLinear(a.x), srgbToLinear(a.y), srgbToLinear(a.z), a.w);
  const bL = new Vec4(srgbToLinear(b.x), srgbToLinear(b.y), srgbToLinear(b.z), b.w);
  const mixed = Vec4.lerp(aL, bL, t) as Vec4;
  return new Vec4(
    clamp01(linearToSrgb(mixed.x)),
    clamp01(linearToSrgb(mixed.y)),
    clamp01(linearToSrgb(mixed.z)),
    mixed.w,
  );
}

function lerpOklab(a: Vec4, b: Vec4, t: number): Vec4 {
  const [La, aa, ba] = vec4ToOklab(a);
  const [Lb, ab, bb] = vec4ToOklab(b);
  return oklabToVec4(
    La + (Lb - La) * t,
    aa + (ab - aa) * t,
    ba + (bb - ba) * t,
    a.w + (b.w - a.w) * t,
  );
}

function lerpOklch(a: Vec4, b: Vec4, t: number): Vec4 {
  const [La, Ca, Ha] = vec4ToOklch(a);
  const [Lb, Cb, Hb] = vec4ToOklch(b);
  return oklabToVec4(
    La + (Lb - La) * t,
    (Ca + (Cb - Ca) * t) * Math.cos(lerpHue(Ha, Hb, t)),
    (Ca + (Cb - Ca) * t) * Math.sin(lerpHue(Ha, Hb, t)),
    a.w + (b.w - a.w) * t,
  );
}

// Mode definitions

interface Mode {
  name:        string;
  formula:     string;
  interpolate: (a: Vec4, b: Vec4, t: number) => Vec4;
}

const EASING_MODES: Mode[] = [
  {
    name:        'Linear',
    formula:     'Vec4.lerp(a, b, t)',
    interpolate: (a, b, t) => lerpSrgb(a, b, t),
  },
  {
    name:        'Smoothstep',
    formula:     'Vec4.lerp(a, b, t²(3−2t))',
    interpolate: (a, b, t) => lerpSrgb(a, b, t * t * (3 - 2 * t)),
  },
  {
    name:        'Ease In — cubic',
    formula:     'Vec4.lerp(a, b, t³)',
    interpolate: (a, b, t) => lerpSrgb(a, b, t * t * t),
  },
  {
    name:        'Ease Out — cubic',
    formula:     'Vec4.lerp(a, b, 1−(1−t)³)',
    interpolate: (a, b, t) => lerpSrgb(a, b, 1 - (1 - t) ** 3),
  },
  {
    name:        'Ease In-Out — sine',
    formula:     'Vec4.lerp(a, b, −(cos(πt)−1)/2)',
    interpolate: (a, b, t) => lerpSrgb(a, b, -(Math.cos(Math.PI * t) - 1) / 2),
  },
];

const SPACE_MODES: Mode[] = [
  {
    name:        'Gamma-correct (linear light)',
    formula:     'linearise -> lerp -> re-linearise',
    interpolate: lerpLinearLight,
  },
  {
    name:        'Oklab',
    formula:     'sRGB -> Oklab -> lerp L,a,b -> sRGB',
    interpolate: lerpOklab,
  },
  {
    name:        'Oklch — hue arc',
    formula:     'sRGB -> Oklch -> lerp L,C,H -> sRGB',
    interpolate: lerpOklch,
  },
];

// State

function hexToVec4(hex: string): Vec4 {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new Vec4(r, g, b, 1);
}

function vec4ToCss(v: Vec4): string {
  return `rgb(${Math.round(v.x * 255)}, ${Math.round(v.y * 255)}, ${Math.round(v.z * 255)})`;
}

function fmtVec4(v: Vec4): string {
  return `Vec4(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}, ${v.w.toFixed(2)})`;
}

let colA = hexToVec4('#e63b5e');
let colB = hexToVec4('#22b0f0');
let t    = 0.5;

// DOM

const colorAInput  = document.getElementById('colorA')  as HTMLInputElement;
const colorBInput  = document.getElementById('colorB')  as HTMLInputElement;
const tSlider      = document.getElementById('tSlider') as HTMLInputElement;
const tNum         = document.getElementById('tNum')    as HTMLInputElement;
const vecAEl       = document.getElementById('vecA')!;
const vecBEl       = document.getElementById('vecB')!;
const resultSwatch = document.getElementById('result-swatch')!;
const resultVec    = document.getElementById('result-vec')!;
const gradPanel    = document.getElementById('grad-panel')!;

// Build gradient strip elements

interface Strip {
  canvas: HTMLCanvasElement;
  dot:    HTMLDivElement;
  val:    HTMLSpanElement;
  mode:   Mode;
}

function buildStrips(modes: Mode[], sectionTitle: string): Strip[] {
  const sectionEl = document.createElement('div');
  sectionEl.className = 'grad-section-header';
  sectionEl.textContent = sectionTitle;
  gradPanel.appendChild(sectionEl);

  return modes.map(mode => {
    const container = document.createElement('div');
    container.className = 'grad-strip';

    const header = document.createElement('div');
    header.className = 'grad-header';
    header.innerHTML = `<span class="grad-name">${mode.name}</span><span class="grad-formula">${mode.formula}</span>`;

    const row = document.createElement('div');
    row.className = 'grad-row';

    const cvs = document.createElement('canvas');
    cvs.className = 'grad-canvas';

    const dot = document.createElement('div');
    dot.className = 'grad-dot';

    const val = document.createElement('span');
    val.className = 'grad-val';

    row.appendChild(cvs);
    row.appendChild(dot);
    container.appendChild(header);
    container.appendChild(row);
    container.appendChild(val);
    gradPanel.appendChild(container);

    return { canvas: cvs, dot, val, mode };
  });
}

const easingStrips = buildStrips(EASING_MODES, 'Easing — in sRGB space');
const spaceStrips  = buildStrips(SPACE_MODES,  'Colour-space interpolation');
const allStrips    = [...easingStrips, ...spaceStrips];

// Render

function renderStrip(strip: Strip) {
  const cvs = strip.canvas;
  const W = cvs.clientWidth;
  const H = cvs.clientHeight;
  if (W === 0) return;

  const dpr = window.devicePixelRatio || 1;
  cvs.width  = W * dpr;
  cvs.height = H * dpr;

  const ctx = cvs.getContext('2d')!;
  ctx.scale(dpr, dpr);

  for (let px = 0; px < W; px++) {
    const pxT = px / (W - 1);
    const col  = strip.mode.interpolate(colA, colB, pxT);
    ctx.fillStyle = vec4ToCss(col);
    ctx.fillRect(px, 0, 1, H);
  }

  // t marker line
  const markerX = t * (W - 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(markerX, 0);
  ctx.lineTo(markerX, H);
  ctx.stroke();
}

function renderAll() {
  vecAEl.textContent = fmtVec4(colA);
  vecBEl.textContent = fmtVec4(colB);

  const linearCol = Vec4.lerp(colA, colB, t) as Vec4;
  resultSwatch.style.background = vec4ToCss(linearCol);
  resultVec.textContent = fmtVec4(linearCol);

  for (const strip of allStrips) {
    renderStrip(strip);
    const col = strip.mode.interpolate(colA, colB, t);
    strip.dot.style.background = vec4ToCss(col);
    strip.val.textContent = fmtVec4(col);
  }
}

// Controls wiring

colorAInput.addEventListener('input', () => { colA = hexToVec4(colorAInput.value); renderAll(); });
colorBInput.addEventListener('input', () => { colB = hexToVec4(colorBInput.value); renderAll(); });

tSlider.addEventListener('input', () => {
  t = parseFloat(tSlider.value);
  tNum.value = String(t);
  renderAll();
});

tNum.addEventListener('change', () => {
  t = Math.max(0, Math.min(1, parseFloat(tNum.value)));
  tSlider.value = String(t);
  renderAll();
});

window.addEventListener('resize', renderAll);

renderAll();
