import { Vec3 } from "../src/Vec3";
import { Ray } from "../src/Ray";
import { Plane } from "../src/Plane";

const SCALE = 52;

const canvasFill = document.getElementById("canvas-fill") as HTMLDivElement;
const canvas = document.getElementById("ray-canvas") as HTMLCanvasElement;
const resultBox = document.getElementById("resultBox") as HTMLPreElement;

const gi = (id: string) => document.getElementById(id) as HTMLInputElement;
const oxSlider = gi("oxSlider"); const oxNum = gi("oxNum");
const ozSlider = gi("ozSlider"); const ozNum = gi("ozNum");
const dirSlider = gi("dirSlider"); const dirNum = gi("dirNum");
const tSlider = gi("tSlider");   const tNum   = gi("tNum");
const srSlider = gi("srSlider"); const srNum  = gi("srNum");

// Fixed scene objects
const SPHERE_CENTER = new Vec3(2, 0, 1);
const BOX_MIN = new Vec3(-1.2, -0.5, -0.8);
const BOX_MAX = new Vec3(1.2, 0.5, 0.8);
const SCENE_PLANE = new Plane(new Vec3(0, 0, 1), -3.5);

function w2c(x: number, z: number, cx: number, cy: number): [number, number] {
  return [cx + x * SCALE, cy - z * SCALE];
}

function getRay(): Ray {
  const ox = parseFloat(oxSlider.value);
  const oz = parseFloat(ozSlider.value);
  const rad = (parseFloat(dirSlider.value) * Math.PI) / 180;
  return new Ray(new Vec3(ox, 0, oz), new Vec3(Math.cos(rad), 0, Math.sin(rad)));
}

function arrowHead(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  size = 10
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - size * Math.cos(angle - 0.35), y2 - size * Math.sin(angle - 0.35));
  ctx.lineTo(x2 - size * Math.cos(angle + 0.35), y2 - size * Math.sin(angle + 0.35));
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
  const bg     = cs.getPropertyValue("--surface").trim();
  const border = cs.getPropertyValue("--border").trim();
  const green  = cs.getPropertyValue("--green").trim();
  const amber  = cs.getPropertyValue("--amber").trim();
  const purple = cs.getPropertyValue("--purple").trim();
  const red    = cs.getPropertyValue("--red").trim();

  const cx = W / 2;
  const cy = H / 2;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  for (let i = -Math.ceil(W / 2 / SCALE) - 1; i <= Math.ceil(W / 2 / SCALE) + 1; i++) {
    ctx.beginPath(); ctx.moveTo(cx + i * SCALE, 0); ctx.lineTo(cx + i * SCALE, H); ctx.stroke();
  }
  for (let i = -Math.ceil(H / 2 / SCALE) - 1; i <= Math.ceil(H / 2 / SCALE) + 1; i++) {
    ctx.beginPath(); ctx.moveTo(0, cy + i * SCALE); ctx.lineTo(W, cy + i * SCALE); ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  const ray = getRay();
  const t = parseFloat(tSlider.value);
  const sphereR = parseFloat(srSlider.value);

  const hitSphere = ray.intersectSphere(SPHERE_CENTER, sphereR);
  const hitBox    = ray.intersectBox(BOX_MIN, BOX_MAX);
  const hitPlane  = ray.intersectPlane(SCENE_PLANE);
  const atT       = ray.at(t);

  // Draw plane
  const ext = (Math.max(W, H) / SCALE) * 1.5;
  const pnx = -SCENE_PLANE.constant * SCENE_PLANE.normal.x;
  const pnz = -SCENE_PLANE.constant * SCENE_PLANE.normal.z;
  const ptdx = -SCENE_PLANE.normal.z;
  const ptdz =  SCENE_PLANE.normal.x;
  const [pl1x, pl1y] = w2c(pnx + ptdx * ext, pnz + ptdz * ext, cx, cy);
  const [pl2x, pl2y] = w2c(pnx - ptdx * ext, pnz - ptdz * ext, cx, cy);

  ctx.strokeStyle = hitPlane ? purple : "rgba(136,102,255,0.25)";
  ctx.lineWidth = hitPlane ? 2 : 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath(); ctx.moveTo(pl1x, pl1y); ctx.lineTo(pl2x, pl2y); ctx.stroke();
  ctx.setLineDash([]);

  // Draw box
  const [bx1, by1] = w2c(BOX_MIN.x, BOX_MIN.z, cx, cy);
  const [bx2, by2] = w2c(BOX_MAX.x, BOX_MAX.z, cx, cy);
  ctx.fillStyle = hitBox ? "rgba(255,201,64,0.08)" : "rgba(255,201,64,0.03)";
  ctx.strokeStyle = hitBox ? amber : "rgba(255,201,64,0.25)";
  ctx.lineWidth = hitBox ? 2 : 1.5;
  ctx.beginPath();
  ctx.rect(bx1, by2, bx2 - bx1, by1 - by2);
  ctx.fill();
  ctx.stroke();

  // Draw sphere
  const [scx, scy] = w2c(SPHERE_CENTER.x, SPHERE_CENTER.z, cx, cy);
  ctx.fillStyle = hitSphere ? "rgba(255,85,102,0.08)" : "rgba(255,85,102,0.03)";
  ctx.strokeStyle = hitSphere ? red : "rgba(255,85,102,0.25)";
  ctx.lineWidth = hitSphere ? 2 : 1.5;
  ctx.beginPath();
  ctx.arc(scx, scy, sphereR * SCALE, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ray line
  const farPt = ray.at((Math.max(W, H) / SCALE) * 2);
  const [rox, roy] = w2c(ray.origin.x, ray.origin.z, cx, cy);
  const [rfx, rfy] = w2c(farPt.x, farPt.z, cx, cy);

  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(rox, roy); ctx.lineTo(rfx, rfy); ctx.stroke();

  // Arrow on ray
  const arrowAt = ray.at(2);
  const [arx, ary] = w2c(arrowAt.x, arrowAt.z, cx, cy);
  ctx.fillStyle = green;
  arrowHead(ctx, rox, roy, arx, ary);

  // Origin dot
  ctx.beginPath();
  ctx.arc(rox, roy, 5, 0, Math.PI * 2);
  ctx.fillStyle = green;
  ctx.fill();

  // at(t) marker
  const [atx, aty] = w2c(atT.x, atT.z, cx, cy);
  ctx.beginPath();
  ctx.arc(atx, aty, 4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fill();
  ctx.strokeStyle = green;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = `500 11px var(--font)`;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText(`t=${t}`, atx + 7, aty - 4);

  // Intersection dots
  const hits: [Vec3 | null, string, string][] = [
    [hitSphere, red, "sphere"],
    [hitBox, amber, "box"],
    [hitPlane, purple, "plane"],
  ];
  for (const [hit, col, label] of hits) {
    if (!hit) continue;
    const [hx, hy] = w2c(hit.x, hit.z, cx, cy);
    ctx.beginPath();
    ctx.arc(hx, hy, 6, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.font = `500 11px var(--font)`;
    ctx.fillStyle = col;
    ctx.fillText(label, hx + 9, hy + 4);
  }

  // Result text
  const fv = (v: Vec3 | null) =>
    v ? `Vec3(${v.x.toFixed(2)}, 0, ${v.z.toFixed(2)})` : "null";
  resultBox.textContent = [
    `at(${t.toFixed(1)})          ${fv(atT)}`,
    `intersectSphere  ${fv(hitSphere)}`,
    `intersectBox     ${fv(hitBox)}`,
    `intersectPlane   ${fv(hitPlane)}`,
  ].join("\n");
}

function sync(slider: HTMLInputElement, num: HTMLInputElement) {
  slider.addEventListener("input", () => { num.value = slider.value; render(); });
  num.addEventListener("change", () => { slider.value = num.value; render(); });
}

sync(oxSlider, oxNum);
sync(ozSlider, ozNum);
sync(dirSlider, dirNum);
sync(tSlider, tNum);
sync(srSlider, srNum);

window.addEventListener("resize", render);
render();
