import { Vec4 } from '../src/index';

// ─── Easing modes ─────────────────────────────────────────────────────────────

const MODES: Array<{ name: string; formula: string; ease: (t: number) => number }> = [
  {
    name:    'Linear',
    formula: 'Vec4.lerp(a, b, t)',
    ease:    t => t,
  },
  {
    name:    'Smoothstep',
    formula: 'Vec4.lerp(a, b, t*t*(3 - 2*t))',
    ease:    t => t * t * (3 - 2 * t),
  },
  {
    name:    'Ease In — cubic',
    formula: 'Vec4.lerp(a, b, t*t*t)',
    ease:    t => t * t * t,
  },
  {
    name:    'Ease Out — cubic',
    formula: 'Vec4.lerp(a, b, 1-(1-t)³)',
    ease:    t => 1 - (1 - t) ** 3,
  },
  {
    name:    'Ease In-Out — sine',
    formula: 'Vec4.lerp(a, b, -(cos(πt)-1)/2)',
    ease:    t => -(Math.cos(Math.PI * t) - 1) / 2,
  },
];

// ─── State ────────────────────────────────────────────────────────────────────

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

// ─── DOM ──────────────────────────────────────────────────────────────────────

const colorAInput  = document.getElementById('colorA')  as HTMLInputElement;
const colorBInput  = document.getElementById('colorB')  as HTMLInputElement;
const tSlider      = document.getElementById('tSlider') as HTMLInputElement;
const tNum         = document.getElementById('tNum')    as HTMLInputElement;
const vecAEl       = document.getElementById('vecA')!;
const vecBEl       = document.getElementById('vecB')!;
const resultSwatch = document.getElementById('result-swatch')!;
const resultVec    = document.getElementById('result-vec')!;
const gradPanel    = document.getElementById('grad-panel')!;

// ─── Build gradient strip elements ───────────────────────────────────────────

interface Strip {
  canvas: HTMLCanvasElement;
  dot: HTMLDivElement;
  val: HTMLSpanElement;
}

const strips: Strip[] = MODES.map((mode, i) => {
  const container = document.createElement('div');
  container.className = 'grad-strip';

  const header = document.createElement('div');
  header.className = 'grad-header';
  header.innerHTML = `<span class="grad-name">${mode.name}</span><span class="grad-formula">${mode.formula}</span>`;

  const row = document.createElement('div');
  row.className = 'grad-row';

  const cvs = document.createElement('canvas');
  cvs.className = 'grad-canvas';
  cvs.id = `grad-${i}`;

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

  return { canvas: cvs, dot, val };
});

// ─── Render ───────────────────────────────────────────────────────────────────

function renderStrip(strip: Strip, ease: (t: number) => number) {
  const cvs = strip.canvas;
  const W = cvs.clientWidth;
  const H = cvs.clientHeight;
  if (W === 0) return;

  const dpr = window.devicePixelRatio || 1;
  cvs.width  = W * dpr;
  cvs.height = H * dpr;

  const ctx = cvs.getContext('2d')!;
  ctx.scale(dpr, dpr);

  // Draw gradient as discrete strips
  for (let px = 0; px < W; px++) {
    const pxT    = px / (W - 1);
    const mapped = ease(pxT);
    const col    = Vec4.lerp(colA, colB, mapped);
    ctx.fillStyle = vec4ToCss(col);
    ctx.fillRect(px, 0, 1, H);
  }

  // Draw t marker
  const markerX = t * (W - 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(markerX, 0);
  ctx.lineTo(markerX, H);
  ctx.stroke();
}

function renderAll() {
  // Update colour labels
  vecAEl.textContent = fmtVec4(colA);
  vecBEl.textContent = fmtVec4(colB);

  // Linear result used as the global "result at t" swatch
  const linearCol = Vec4.lerp(colA, colB, t);
  resultSwatch.style.background = vec4ToCss(linearCol);
  resultVec.textContent = fmtVec4(linearCol);

  MODES.forEach((mode, i) => {
    const strip = strips[i];
    renderStrip(strip, mode.ease);

    const mapped  = mode.ease(t);
    const col     = Vec4.lerp(colA, colB, mapped);
    strip.dot.style.background = vec4ToCss(col);
    strip.val.textContent = fmtVec4(col);
  });
}

// ─── Controls wiring ─────────────────────────────────────────────────────────

colorAInput.addEventListener('input', () => {
  colA = hexToVec4(colorAInput.value);
  renderAll();
});

colorBInput.addEventListener('input', () => {
  colB = hexToVec4(colorBInput.value);
  renderAll();
});

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
