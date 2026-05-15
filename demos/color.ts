import { Color } from "../src/Color";

const colorAInput = document.getElementById("colorA") as HTMLInputElement;
const colorBInput = document.getElementById("colorB") as HTMLInputElement;
const swatchA = document.getElementById("swatchA") as HTMLDivElement;
const swatchB = document.getElementById("swatchB") as HTMLDivElement;
const infoA = document.getElementById("infoA") as HTMLPreElement;
const infoB = document.getElementById("infoB") as HTMLPreElement;
const tSlider = document.getElementById("tSlider") as HTMLInputElement;
const tNum = document.getElementById("tNum") as HTMLInputElement;
const lerpSwatch = document.getElementById("lerpSwatch") as HTMLDivElement;
const lerpInfo = document.getElementById("lerpInfo") as HTMLPreElement;
const canvasFill = document.getElementById("canvas-fill") as HTMLDivElement;
const canvas = document.getElementById("color-canvas") as HTMLCanvasElement;

function fmt(c: Color): string {
  const [h, s, l] = c.toHSL();
  return [
    `hex  ${c.toHex()}`,
    `rgb  (${(c.r * 255) | 0}, ${(c.g * 255) | 0}, ${(c.b * 255) | 0})`,
    `hsl  (${h.toFixed(1)}°, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`,
  ].join("\n");
}

function render() {
  const t = parseFloat(tSlider.value);
  const a = Color.fromHex(colorAInput.value);
  const b = Color.fromHex(colorBInput.value);
  const lerped = Color.lerp(a, b, t);

  swatchA.style.background = a.toCSS();
  swatchB.style.background = b.toCSS();
  lerpSwatch.style.background = lerped.toCSS();
  infoA.textContent = fmt(a);
  infoB.textContent = fmt(b);
  lerpInfo.textContent = fmt(lerped);

  drawCanvas(a, b, t);
}

function drawCanvas(colorA: Color, colorB: Color, t: number) {
  const W = canvasFill.clientWidth;
  const H = canvasFill.clientHeight;
  if (W === 0 || H === 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue("--surface")
    .trim();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const stripH = 28;
  const stripPad = 20;
  const stripY = H - stripH - stripPad;
  const stripX = stripPad;
  const stripW = W - stripPad * 2;

  // Hue wheel
  const cx = W / 2;
  const cy = (stripY - stripPad) / 2;
  const outerR = Math.min(W / 2, cy) - 16;
  const ringWidth = outerR * 0.28;
  const innerR = outerR - ringWidth;

  for (let i = 0; i < 360; i++) {
    const a0 = (i / 360) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1.5) / 360) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, a0, a1);
    ctx.arc(cx, cy, innerR, a1, a0, true);
    ctx.closePath();
    ctx.fillStyle = Color.fromHSL(i, 0.85, 0.55).toCSS();
    ctx.fill();
  }

  // Centre fill — lerped colour
  ctx.beginPath();
  ctx.arc(cx, cy, innerR - 4, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, innerR - 10, 0, Math.PI * 2);
  ctx.fillStyle = Color.lerp(colorA, colorB, t).toCSS();
  ctx.fill();

  // Markers on the ring for A and B
  for (const [col, label] of [
    [colorA, "A"],
    [colorB, "B"],
  ] as [Color, string][]) {
    const [hue] = col.toHSL();
    const angle = (hue / 360) * Math.PI * 2 - Math.PI / 2;
    const markerR = innerR + ringWidth / 2;
    const mx = cx + Math.cos(angle) * markerR;
    const my = cy + Math.sin(angle) * markerR;
    ctx.beginPath();
    ctx.arc(mx, my, 6, 0, Math.PI * 2);
    ctx.fillStyle = col.toCSS();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = `600 10px var(--font)`;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, mx, my);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Lerp strip
  for (let i = 0; i <= stripW; i++) {
    ctx.fillStyle = Color.lerp(colorA, colorB, i / stripW).toCSS();
    ctx.fillRect(stripX + i, stripY, 1, stripH);
  }

  // t marker
  const mx = stripX + t * stripW;
  ctx.beginPath();
  ctx.moveTo(mx, stripY - 5);
  ctx.lineTo(mx - 5, stripY - 11);
  ctx.lineTo(mx + 5, stripY - 11);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fill();
}

colorAInput.addEventListener("input", render);
colorBInput.addEventListener("input", render);

tSlider.addEventListener("input", () => {
  tNum.value = tSlider.value;
  render();
});
tNum.addEventListener("change", () => {
  tSlider.value = tNum.value;
  render();
});

window.addEventListener("resize", render);
render();
