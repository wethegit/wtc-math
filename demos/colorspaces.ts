import { Color } from "../src/Color";

// DOM
const gi = (id: string) => document.getElementById(id) as HTMLInputElement;
const colorAInput = gi("colorA");
const colorBInput = gi("colorB");
const swatchA     = document.getElementById("swatchA") as HTMLDivElement;
const swatchB     = document.getElementById("swatchB") as HTMLDivElement;
const tSlider     = gi("tSlider");
const tNum        = gi("tNum");
const animBtn     = document.getElementById("animBtn") as HTMLButtonElement;
const palN        = gi("palN");  const palNn = gi("palNn");
const palL        = gi("palL");  const palLn = gi("palLn");
const palC        = gi("palC");  const palCn = gi("palCn");
const canvasFill  = document.getElementById("canvas-fill") as HTMLDivElement;
const canvas      = document.getElementById("cs-canvas") as HTMLCanvasElement;

// State
let t = 0.5;
let animating = false;
let animStart = 0;
let raf = 0;

const STRIPS = [
  { label: "sRGB",  formula: "Color.lerp(a, b, t)",       fn: (a: Color, b: Color, t: number) => Color.lerp(a, b, t) },
  { label: "Oklab", formula: "Color.lerpOklab(a, b, t)",  fn: (a: Color, b: Color, t: number) => Color.lerpOklab(a, b, t) },
  { label: "Oklch", formula: "Color.lerpOklch(a, b, t)",  fn: (a: Color, b: Color, t: number) => Color.lerpOklch(a, b, t) },
];

// Animation

function tick(ts: number) {
  if (!animating) return;
  if (animStart === 0) animStart = ts;
  t = Math.sin(((ts - animStart) / 1400)) * 0.5 + 0.5;
  tSlider.value = String(t);
  tNum.value = t.toFixed(3);
  draw();
  raf = requestAnimationFrame(tick);
}

animBtn.addEventListener("click", () => {
  animating = !animating;
  animBtn.classList.toggle("active", animating);
  if (animating) {
    animStart = 0;
    raf = requestAnimationFrame(tick);
  } else {
    cancelAnimationFrame(raf);
  }
});

// Render

function draw() {
  const W = canvasFill.clientWidth;
  const H = canvasFill.clientHeight;
  if (!W || !H) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const cs       = getComputedStyle(document.documentElement);
  const bg       = cs.getPropertyValue("--surface").trim();
  const border   = cs.getPropertyValue("--border").trim();
  const textMid  = cs.getPropertyValue("--text-mid").trim();
  const textDim  = cs.getPropertyValue("--text-dim").trim();

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const colorA = Color.fromHex(colorAInput.value);
  const colorB = Color.fromHex(colorBInput.value);
  swatchA.style.background = colorA.toCSS();
  swatchB.style.background = colorB.toCSS();

  const n    = parseInt(palN.value);
  const palLv = parseFloat(palL.value);
  const palCv = parseFloat(palC.value);

  const PAD     = 20;
  const LABEL_W = 56;
  const stripX  = PAD + LABEL_W;
  const stripW  = W - stripX - PAD;
  const STRIP_H = Math.max(40, Math.min(64, (H * 0.38) / STRIPS.length - 14));
  const STRIP_GAP = 12;

  // ── Section 1: Lerp comparison ───────────────────────────────────────────

  let y = PAD + 4;

  sectionLabel(ctx, "LERP COMPARISON", PAD, y, textDim);
  y += 18;

  const stripTops: number[] = [];

  for (const strip of STRIPS) {
    stripTops.push(y);

    // Label
    ctx.font = `500 11px var(--font)`;
    ctx.fillStyle = textMid;
    ctx.textAlign = "right";
    ctx.fillText(strip.label, PAD + LABEL_W - 8, y + STRIP_H / 2 + 4);

    // Formula (small, below label)
    ctx.font = `300 9px var(--font)`;
    ctx.fillStyle = textDim;
    ctx.fillText(strip.formula, PAD + LABEL_W - 8, y + STRIP_H / 2 + 15);
    ctx.textAlign = "left";

    // Gradient strip — one pixel column at a time
    for (let i = 0; i <= stripW; i++) {
      ctx.fillStyle = strip.fn(colorA, colorB, i / stripW).toCSS();
      ctx.fillRect(stripX + i, y, 1, STRIP_H);
    }

    // Border
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(stripX, y, stripW, STRIP_H);

    y += STRIP_H + STRIP_GAP;
  }

  // t indicator across all strips
  const tX = stripX + t * stripW;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(tX, stripTops[0] - 2);
  ctx.lineTo(tX, stripTops[stripTops.length - 1] + STRIP_H + 2);
  ctx.stroke();
  ctx.restore();

  // t label above first strip
  ctx.font = `500 10px var(--font)`;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.textAlign = "center";
  ctx.fillText(`t=${t.toFixed(2)}`, tX, stripTops[0] - 7);
  ctx.textAlign = "left";

  // Lerped colour dots at current t, right of strips
  for (let i = 0; i < STRIPS.length; i++) {
    const c   = STRIPS[i].fn(colorA, colorB, t);
    const dot = 10;
    const dx  = stripX + stripW + 10;
    const dy  = stripTops[i] + STRIP_H / 2;
    ctx.beginPath();
    ctx.arc(dx + dot, dy, dot, 0, Math.PI * 2);
    ctx.fillStyle = c.toCSS();
    ctx.fill();
  }

  y += 20;

  // ── Section 2: Oklch palette ─────────────────────────────────────────────

  sectionLabel(ctx, "OKLCH PALETTE", PAD, y, textDim);
  y += 18;

  const swatchGap = 6;
  const swatchH   = Math.max(36, Math.min(52, H * 0.1));
  const availW    = W - PAD * 2;
  const swatchW   = Math.min(60, (availW - swatchGap * (n - 1)) / n);
  const rowW      = n * swatchW + (n - 1) * swatchGap;
  const rowX      = PAD + (availW - rowW) / 2;

  for (let i = 0; i < n; i++) {
    const hue = (i / n) * 360;
    const c   = Color.fromOklch(palLv, palCv, hue);
    const sx  = rowX + i * (swatchW + swatchGap);

    ctx.fillStyle = c.toCSS();
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D & { roundRect: Function }).roundRect(sx, y, swatchW, swatchH, 4);
    ctx.fill();

    ctx.font = `400 9px var(--font)`;
    ctx.fillStyle = textDim;
    ctx.textAlign = "center";
    ctx.fillText(c.toHex(), sx + swatchW / 2, y + swatchH + 11);
  }
  ctx.textAlign = "left";

  y += swatchH + 20 + 14;

  // ── Section 3: Oklch H × L field ─────────────────────────────────────────

  const fieldH = H - y - PAD - 4;
  if (fieldH < 30) return;

  sectionLabel(ctx, "OKLCH FIELD  ·  x = hue  ·  y = lightness", PAD, y, textDim);
  y += 18;

  const fieldActualH = H - y - PAD;
  if (fieldActualH < 10) return;

  // Column-gradient approximation: accurate in X, smooth in Y
  for (let fx = 0; fx < stripW; fx++) {
    const hue  = (fx / stripW) * 360;
    const top  = Color.fromOklch(0.88, palCv, hue).toCSS();
    const mid  = Color.fromOklch(0.50, palCv, hue).toCSS();
    const bot  = Color.fromOklch(0.18, palCv, hue).toCSS();
    const grad = ctx.createLinearGradient(0, y, 0, y + fieldActualH);
    grad.addColorStop(0,   top);
    grad.addColorStop(0.5, mid);
    grad.addColorStop(1,   bot);
    ctx.fillStyle = grad;
    ctx.fillRect(stripX + fx, y, 1, fieldActualH);
  }

  // Y-axis labels (lightness)
  ctx.font = `400 9px var(--font)`;
  ctx.fillStyle = textDim;
  for (const [label, pct] of [["L 0.9", 0], ["L 0.5", 0.5], ["L 0.2", 1]] as [string, number][]) {
    const ly = y + pct * fieldActualH;
    ctx.textAlign = "right";
    ctx.fillText(label, stripX - 6, ly + 4);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(stripX, ly);
    ctx.lineTo(stripX + stripW, ly);
    ctx.stroke();
  }
  ctx.textAlign = "left";

  // Border
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.strokeRect(stripX, y, stripW, fieldActualH);
}

function sectionLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) {
  ctx.font = `600 9px var(--font)`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 9);
}

// Sync slider ↔ number input pairs

function sync(
  slider: HTMLInputElement,
  num: HTMLInputElement,
  cb?: (v: number) => void
) {
  const handler = (src: HTMLInputElement, dst: HTMLInputElement) => () => {
    dst.value = src.value;
    cb?.(parseFloat(src.value));
    if (!animating) draw();
  };
  slider.addEventListener("input", handler(slider, num));
  num.addEventListener("change", handler(num, slider));
}

tSlider.addEventListener("input", () => {
  t = parseFloat(tSlider.value);
  tNum.value = t.toFixed(3);
  if (!animating) draw();
});
tNum.addEventListener("change", () => {
  t = parseFloat(tNum.value);
  tSlider.value = String(t);
  if (!animating) draw();
});

colorAInput.addEventListener("input", () => { if (!animating) draw(); });
colorBInput.addEventListener("input", () => { if (!animating) draw(); });

sync(palN, palNn);
sync(palL, palLn);
sync(palC, palCn);

window.addEventListener("resize", draw);
draw();
