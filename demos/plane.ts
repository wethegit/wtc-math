import { Vec3 } from "../src/Vec3";
import { Plane } from "../src/Plane";

const SCALE = 60;

const canvasFill = document.getElementById("canvas-fill") as HTMLDivElement;
const canvas = document.getElementById("plane-canvas") as HTMLCanvasElement;
const angleSlider = document.getElementById("angleSlider") as HTMLInputElement;
const angleNum = document.getElementById("angleNum") as HTMLInputElement;
const constSlider = document.getElementById("constSlider") as HTMLInputElement;
const constNum = document.getElementById("constNum") as HTMLInputElement;
const resultBox = document.getElementById("resultBox") as HTMLPreElement;

let mousePt = new Vec3(2, 0, 1.5);
let angleDeg = 45;
let constant = 0;

function getPlane(): Plane {
  const rad = (angleDeg * Math.PI) / 180;
  return new Plane(new Vec3(Math.cos(rad), 0, Math.sin(rad)), constant);
}

function w2c(x: number, z: number, cx: number, cy: number): [number, number] {
  return [cx + x * SCALE, cy - z * SCALE];
}

function c2w(px: number, py: number, cx: number, cy: number): [number, number] {
  return [(px - cx) / SCALE, (cy - py) / SCALE];
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9 * Math.cos(angle - 0.38), y2 - 9 * Math.sin(angle - 0.38));
  ctx.lineTo(x2 - 9 * Math.cos(angle + 0.38), y2 - 9 * Math.sin(angle + 0.38));
  ctx.closePath();
  ctx.fill();
}

function render() {
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

  const cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue("--surface").trim();
  const border = cs.getPropertyValue("--border").trim();
  const green = cs.getPropertyValue("--green").trim();
  const amber = cs.getPropertyValue("--amber").trim();

  const cx = W / 2;
  const cy = H / 2;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  for (let i = -Math.ceil(W / 2 / SCALE) - 1; i <= Math.ceil(W / 2 / SCALE) + 1; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * SCALE, 0);
    ctx.lineTo(cx + i * SCALE, H);
    ctx.stroke();
  }
  for (let i = -Math.ceil(H / 2 / SCALE) - 1; i <= Math.ceil(H / 2 / SCALE) + 1; i++) {
    ctx.beginPath();
    ctx.moveTo(0, cy + i * SCALE);
    ctx.lineTo(W, cy + i * SCALE);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  const plane = getPlane();

  // Point on plane closest to origin
  const p0x = -plane.constant * plane.normal.x;
  const p0z = -plane.constant * plane.normal.z;
  // Tangent direction along the plane (perpendicular to normal in XZ)
  const tdx = -plane.normal.z;
  const tdz = plane.normal.x;
  const ext = (Math.max(W, H) / SCALE) * 1.5;

  const [s1x, s1y] = w2c(p0x + tdx * ext, p0z + tdz * ext, cx, cy);
  const [s2x, s2y] = w2c(p0x - tdx * ext, p0z - tdz * ext, cx, cy);
  const [p0sx, p0sy] = w2c(p0x, p0z, cx, cy);
  const [nex, ney] = w2c(p0x + plane.normal.x * 1.5, p0z + plane.normal.z * 1.5, cx, cy);

  // Plane line
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(s1x, s1y);
  ctx.lineTo(s2x, s2y);
  ctx.stroke();

  // Normal arrow
  ctx.strokeStyle = green;
  ctx.fillStyle = green;
  ctx.lineWidth = 1.5;
  arrow(ctx, p0sx, p0sy, nex, ney);

  // "n" label
  ctx.font = `500 11px var(--font)`;
  ctx.fillStyle = green;
  ctx.fillText("n", nex + 7, ney - 3);

  // Signed-distance shading: tint positive side
  const dist = plane.distanceTo(mousePt);
  const proj = plane.projectPoint(mousePt);

  const [ptsx, ptsy] = w2c(mousePt.x, mousePt.z, cx, cy);
  const [prsx, prsy] = w2c(proj.x, proj.z, cx, cy);

  // Dashed perpendicular to projection
  ctx.strokeStyle = amber;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(ptsx, ptsy);
  ctx.lineTo(prsx, prsy);
  ctx.stroke();
  ctx.setLineDash([]);

  // Projected point
  ctx.beginPath();
  ctx.arc(prsx, prsy, 4, 0, Math.PI * 2);
  ctx.fillStyle = green;
  ctx.fill();

  // Mouse point
  ctx.beginPath();
  ctx.arc(ptsx, ptsy, 5, 0, Math.PI * 2);
  ctx.fillStyle = amber;
  ctx.fill();

  // Distance label near midpoint
  ctx.font = `500 11px var(--font)`;
  ctx.fillStyle = amber;
  const lmx = (ptsx + prsx) / 2 + 8;
  const lmy = (ptsy + prsy) / 2;
  ctx.fillText(`d = ${dist.toFixed(3)}`, lmx, lmy);

  // Result panel
  resultBox.textContent = [
    `point    Vec3(${mousePt.x.toFixed(2)}, 0, ${mousePt.z.toFixed(2)})`,
    ``,
    `distanceTo(point)`,
    `  ${dist.toFixed(4)}`,
    ``,
    `projectPoint(point)`,
    `  Vec3(${proj.x.toFixed(3)}, 0, ${proj.z.toFixed(3)})`,
  ].join("\n");
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const [wx, wz] = c2w(
    e.clientX - rect.left,
    e.clientY - rect.top,
    canvas.clientWidth / 2,
    canvas.clientHeight / 2
  );
  mousePt = new Vec3(wx, 0, wz);
  render();
});

function sync(slider: HTMLInputElement, num: HTMLInputElement, set: (v: number) => void) {
  slider.addEventListener("input", () => { num.value = slider.value; set(parseFloat(slider.value)); render(); });
  num.addEventListener("change", () => { slider.value = num.value; set(parseFloat(num.value)); render(); });
}

sync(angleSlider, angleNum, (v) => (angleDeg = v));
sync(constSlider, constNum, (v) => (constant = v));

window.addEventListener("resize", render);
render();
