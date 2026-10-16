import { Color } from "../src/Color";

// DOM
const baseInput     = document.getElementById("baseColor")    as HTMLInputElement;
const compareInput  = document.getElementById("compareColor") as HTMLInputElement;
const baseSwatch    = document.getElementById("baseSwatch")   as HTMLDivElement;
const compareSwatch = document.getElementById("compareSwatch") as HTMLDivElement;
const deVal         = document.getElementById("deVal")        as HTMLSpanElement;
const deLabel       = document.getElementById("deLabel")      as HTMLSpanElement;
const tempSlider    = document.getElementById("tempSlider")   as HTMLInputElement;
const tempNum       = document.getElementById("tempNum")      as HTMLInputElement;
const tempSwatch    = document.getElementById("tempSwatch")   as HTMLDivElement;
const tempLabel     = document.getElementById("tempLabel")    as HTMLSpanElement;
const canvasFill    = document.getElementById("canvas-fill")  as HTMLDivElement;
const canvas        = document.getElementById("cm-canvas")    as HTMLCanvasElement;

// ── Harmony types ────────────────────────────────────────────────────────────

const HARMONIES: [string, number[]][] = [
  ["Complementary",       [0, 180]],
  ["Triadic",             [0, 120, 240]],
  ["Analogous",           [-30, -15, 0, 15, 30]],
  ["Split-comp",          [0, 150, 210]],
  ["Tetradic",            [0, 90, 180, 270]],
];

// ── ΔE in Oklab ──────────────────────────────────────────────────────────────

function deltaE(a: Color, b: Color): number {
  const [L1, a1, b1] = a.toOklab();
  const [L2, a2, b2] = b.toOklab();
  return Math.sqrt((L2 - L1) ** 2 + (a2 - a1) ** 2 + (b2 - b1) ** 2);
}

const DE_THRESHOLDS: [number, string][] = [
  [0.02,  "imperceptible"],
  [0.05,  "just noticeable"],
  [0.10,  "similar"],
  [0.20,  "distinct"],
];

function deInterpret(de: number): string {
  for (const [thresh, label] of [...DE_THRESHOLDS].reverse()) {
    if (de >= thresh) return label;
  }
  return "imperceptible";
}

// ── Blackbody: Kang et al. polynomial → CIE xy → XYZ → sRGB ─────────────────

function kelvinToColor(T: number): Color {
  // CIE xy chromaticity
  const x = T < 4000
    ? -0.2661239e9 / T ** 3 - 0.2343580e6 / T ** 2 + 0.8776956e3 / T + 0.179910
    : -3.0258469e9 / T ** 3 + 2.1070379e6 / T ** 2 + 0.2226347e3 / T + 0.240390;

  const y = T < 2222
    ? -1.1063814 * x ** 3 - 1.34811020 * x ** 2 + 2.18555832 * x - 0.20219683
    : T < 4000
    ? -0.9549476 * x ** 3 - 1.37418593 * x ** 2 + 2.09137015 * x - 0.16748867
    :  3.0817580 * x ** 3 - 5.87338670 * x ** 2 + 3.75112997 * x - 0.37001483;

  // xy → XYZ (Y = 1)
  const X = x / y, Z = (1 - x - y) / y;

  // XYZ → linear sRGB (D65 matrix)
  const lr =  3.2406 * X - 1.5372 - 0.4986 * Z;
  const lg = -0.9689 * X + 1.8758 + 0.0415 * Z;
  const lb =  0.0557 * X - 0.2040 + 1.0570 * Z;

  // Normalise to brightest channel then gamma-encode
  const m = Math.max(lr, lg, lb);
  const enc = (c: number) => {
    const v = Math.max(0, c / m);
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };
  return new Color(enc(lr), enc(lg), enc(lb));
}

const TEMP_LABELS: [number, string][] = [
  [1000,  "1kK"],
  [1900,  "candle"],
  [2700,  "tungsten"],
  [5500,  "daylight"],
  [6500,  "D65"],
  [10000, "blue sky"],
  [12000, "12kK"],
];

// ── Draw ─────────────────────────────────────────────────────────────────────

function sectionHead(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, col: string) {
  ctx.font = `600 9px var(--font)`;
  ctx.fillStyle = col;
  ctx.textAlign = "left";
  ctx.fillText(text, x, y + 9);
}

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

  const cs      = getComputedStyle(document.documentElement);
  const bg      = cs.getPropertyValue("--surface").trim();
  const border  = cs.getPropertyValue("--border").trim();
  const textMid = cs.getPropertyValue("--text-mid").trim();
  const textDim = cs.getPropertyValue("--text-dim").trim();
  const amber   = cs.getPropertyValue("--amber").trim();

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const PAD     = 20;
  const LABEL_W = 72;
  const colX    = PAD + LABEL_W;
  const colW    = W - colX - PAD;

  const base    = Color.fromHex(baseInput.value);
  const compare = Color.fromHex(compareInput.value);
  const [bL, bC, bH] = base.toOklch();
  const de      = deltaE(base, compare);
  const tempK   = parseInt(tempSlider.value);
  const tempCol = kelvinToColor(tempK);

  // Update sidebar
  baseSwatch.style.background    = base.toCSS();
  compareSwatch.style.background = compare.toCSS();
  deVal.textContent   = de.toFixed(4);
  deLabel.textContent = deInterpret(de);
  tempSwatch.style.background = tempCol.toCSS();
  tempLabel.textContent = `${tempK.toLocaleString()}K → ${tempCol.toHex()}`;

  // ── 1. Harmonies ──────────────────────────────────────────────────────────

  let y = PAD;
  sectionHead(ctx, "COLOUR HARMONIES  ·  Oklch hue offsets", PAD, y, textDim);
  y += 18;

  const harmTotalH = H * 0.46 - 18 - PAD;
  const rowH   = Math.min(48, (harmTotalH - (HARMONIES.length - 1) * 5) / HARMONIES.length);
  const swW    = Math.min(rowH * 1.15, (colW - (5 - 1) * 5) / 5);
  const swGap  = 5;

  for (const [name, offsets] of HARMONIES) {
    ctx.font = `500 10px var(--font)`;
    ctx.fillStyle = textMid;
    ctx.textAlign = "right";
    ctx.fillText(name, colX - 8, y + rowH / 2 + 3);
    ctx.textAlign = "left";

    for (let i = 0; i < offsets.length; i++) {
      const hue = ((bH + offsets[i]) % 360 + 360) % 360;
      const c   = Color.fromOklch(bL, bC, hue);
      const sx  = colX + i * (swW + swGap);

      ctx.fillStyle = c.toCSS();
      ctx.beginPath();
      (ctx as any).roundRect(sx, y, swW, rowH, 3);
      ctx.fill();

      if (offsets[i] === 0) {
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        (ctx as any).roundRect(sx, y, swW, rowH, 3);
        ctx.stroke();
      }

      ctx.font = `400 9px var(--font)`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(hue)}°`, sx + swW / 2, y + rowH - 5);
    }
    ctx.textAlign = "left";

    y += rowH + 5;
  }

  y += 18;

  // ── 2. ΔE ─────────────────────────────────────────────────────────────────

  sectionHead(ctx, "ΔE  ·  PERCEPTUAL DISTANCE  ·  Oklab Euclidean", PAD, y, textDim);
  y += 18;

  const circR  = Math.min(24, (H * 0.14) / 2);
  const circY  = y + circR;
  const cAx    = colX + circR;
  const cBx    = colX + circR * 3.6;

  // Base circle
  ctx.beginPath();
  ctx.arc(cAx, circY, circR, 0, Math.PI * 2);
  ctx.fillStyle = base.toCSS();
  ctx.fill();

  // Compare circle
  ctx.beginPath();
  ctx.arc(cBx, circY, circR, 0, Math.PI * 2);
  ctx.fillStyle = compare.toCSS();
  ctx.fill();

  // Line + ΔE label between them
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(cAx + circR + 3, circY);
  ctx.lineTo(cBx - circR - 3, circY);
  ctx.stroke();
  ctx.setLineDash([]);

  const midX = (cAx + cBx) / 2;
  ctx.font = `600 14px var(--font)`;
  ctx.fillStyle = amber;
  ctx.textAlign = "center";
  ctx.fillText(`${de.toFixed(3)}`, midX, circY - circR - 5);
  ctx.font = `400 9px var(--font)`;
  ctx.fillStyle = textDim;
  ctx.fillText("ΔE", midX, circY + circR + 12);
  ctx.textAlign = "left";

  // Gauge bar
  const gaugeY = y + circR * 2 + 18;
  const gaugeH = 8;
  const MAX_DE = 0.45;

  const grad = ctx.createLinearGradient(colX, 0, colX + colW, 0);
  grad.addColorStop(0,    "rgba(57,255,138,0.35)");
  grad.addColorStop(0.11, "rgba(57,255,138,0.15)");
  grad.addColorStop(0.33, "rgba(255,201,64,0.25)");
  grad.addColorStop(1,    "rgba(255,85,102,0.35)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  (ctx as any).roundRect(colX, gaugeY, colW, gaugeH, gaugeH / 2);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  (ctx as any).roundRect(colX, gaugeY, colW, gaugeH, gaugeH / 2);
  ctx.stroke();

  // Threshold ticks
  ctx.font = `400 9px var(--font)`;
  for (const [thresh, label] of DE_THRESHOLDS) {
    const tx = colX + (thresh / MAX_DE) * colW;
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(tx, gaugeY - 3);
    ctx.lineTo(tx, gaugeY + gaugeH + 3);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = textDim;
    ctx.textAlign = "center";
    ctx.fillText(label, tx, gaugeY + gaugeH + 13);
  }
  ctx.textAlign = "left";

  // Marker dot
  const markerX = colX + Math.min(de / MAX_DE, 1) * colW;
  ctx.beginPath();
  ctx.arc(markerX, gaugeY + gaugeH / 2, gaugeH / 2 + 2, 0, Math.PI * 2);
  ctx.fillStyle = amber;
  ctx.fill();

  y = gaugeY + gaugeH + 24 + 10;

  // ── 3. Blackbody ──────────────────────────────────────────────────────────

  sectionHead(ctx, "BLACKBODY RADIATION  ·  Kang polynomial → XYZ → sRGB", PAD, y, textDim);
  y += 18;

  const bbH = H - y - PAD;
  if (bbH < 24) return;

  const stripH = Math.min(52, bbH * 0.6);
  const MIN_K = 1000, MAX_K = 12000;

  for (let i = 0; i <= colW; i++) {
    const K = MIN_K + (i / colW) * (MAX_K - MIN_K);
    ctx.fillStyle = kelvinToColor(K).toCSS();
    ctx.fillRect(colX + i, y, 1, stripH);
  }
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.strokeRect(colX, y, colW, stripH);

  // Current temp marker
  const tPct = (tempK - MIN_K) / (MAX_K - MIN_K);
  const tX   = colX + tPct * colW;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(tX, y - 5);
  ctx.lineTo(tX, y + stripH + 5);
  ctx.stroke();
  ctx.setLineDash([]);

  // Temp labels
  ctx.font = `400 9px var(--font)`;
  for (const [K, label] of TEMP_LABELS) {
    const lx = colX + ((K - MIN_K) / (MAX_K - MIN_K)) * colW;
    ctx.fillStyle = textDim;
    ctx.textAlign = "center";
    ctx.fillText(label, lx, y + stripH + 13);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx, y);
    ctx.lineTo(lx, y + stripH);
    ctx.stroke();
  }
  ctx.textAlign = "left";
}

// Events

baseInput.addEventListener("input", draw);
compareInput.addEventListener("input", draw);

function syncSlider(slider: HTMLInputElement, num: HTMLInputElement) {
  slider.addEventListener("input", () => { num.value = slider.value; draw(); });
  num.addEventListener("change", () => { slider.value = num.value; draw(); });
}
syncSlider(tempSlider, tempNum);

window.addEventListener("resize", draw);
draw();
