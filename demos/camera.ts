import { Vec3, Mat4, Quat } from "../src/index";

// Constants

const SCALE = 100; // px per world unit

// Scene labels

const LABELS: Array<{
  pos: [number, number, number];
  text: string;
  cls: string;
}> = [
  { pos: [2.2, 0, 0], text: "+X", cls: "pt-label--x" },
  { pos: [0, 2.2, 0], text: "+Y", cls: "pt-label--y" },
  { pos: [0, 0, 2.2], text: "+Z", cls: "pt-label--z" },
];

// State

let yawDeg = 30;
let pitchDeg = 20;
let radius = 5;

// DOM

const viewport = document.getElementById("viewport")!;
const scene3d = document.getElementById("scene-3d")!;
const canvas = document.getElementById("scene-canvas") as HTMLCanvasElement;
const quatBox = document.getElementById("quat-box")!;
const lookatBox = document.getElementById("lookat-box")!;
const codeBox = document.getElementById("code-box")!;

function getEl<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

const sliders = {
  yaw: getEl<HTMLInputElement>("yaw"),
  pitch: getEl<HTMLInputElement>("pitch"),
  radius: getEl<HTMLInputElement>("radius"),
};
const nums = {
  yaw: getEl<HTMLInputElement>("yawn"),
  pitch: getEl<HTMLInputElement>("pitchn"),
  radius: getEl<HTMLInputElement>("radiusn"),
};

const labelEls = LABELS.map((l) => {
  const el = document.createElement("div");
  el.className = `pt-label ${l.cls}`;
  el.textContent = l.text;
  viewport.appendChild(el);
  return el;
});

// Helpers

const fmt3 = (n: number) => n.toFixed(3);
const fmt2 = (n: number) => parseFloat(n.toFixed(2)).toString();

function projectPoint(
  wx: number,
  wy: number,
  wz: number,
  pv: Mat4,
  vw: number,
  vh: number,
) {
  const m = pv.array;
  const cx = m[0] * wx + m[4] * wy + m[8] * wz + m[12];
  const cy = m[1] * wx + m[5] * wy + m[9] * wz + m[13];
  const cz = m[2] * wx + m[6] * wy + m[10] * wz + m[14];
  const cw = m[3] * wx + m[7] * wy + m[11] * wz + m[15];

  if (cw < 0.01) return null;

  return {
    sx: ((cx / cw) * 0.5 + 0.5) * vw,
    sy: (1 - ((cy / cw) * 0.5 + 0.5)) * vh,
    depth: cz / cw,
    inFrustum:
      Math.abs(cx / cw) < 1.2 && Math.abs(cy / cw) < 1.2 && cz / cw < 1,
  };
}

// Convert our row-major view matrix to a CSS matrix3d string.
// Reading our row-major array directly into CSS matrix3d (column-major) is
// equivalent to transposing it — which is exactly what the row->column-vector
// convention change requires. We also scale the translation components.
function toCssMatrix(view: Mat4): string {
  const m = [...view.array];
  m[12] *= SCALE;
  m[13] *= SCALE;
  m[14] *= SCALE;
  return `matrix3d(${m.join(",")})`;
}

// Render

function render() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (vw === 0 || vh === 0) return;

  // Canvas setup
  const dpr = window.devicePixelRatio || 1;
  canvas.width = vw * dpr;
  canvas.height = vh * dpr;
  canvas.style.width = `${vw}px`;
  canvas.style.height = `${vh}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, vw, vh);

  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;

  // Build quaternion: yaw rotates around world Y, pitch around local X.
  // Negate pitch so positive degrees move the camera upward.
  const qYaw = Quat.fromAxisAngle(new Vec3(0, 1, 0), yaw);
  const qPitch = Quat.fromAxisAngle(new Vec3(1, 0, 0), -pitch);
  const q = qYaw.multiplyNew(qPitch) as Quat;

  // Rotate the default eye position (0, 0, radius) by the quaternion to
  // get the camera's world-space position on the orbit sphere.
  const rotMat = Mat4.fromQuat(q.array)!;
  const eye = new Vec3(0, 0, radius).transformByMat4New(rotMat);

  // Camera always looks at the cube — the origin.
  const target = new Vec3(0, 0, 0);
  const forward = target.subtractNew(eye).normaliseNew();

  // Build view matrix and projection
  const view = Mat4.lookAt(eye, target, [0, 1, 0])!;
  const fov = Math.PI / 3; // 60°
  const proj = Mat4.perspective(fov, vw / vh, 0.1, 100);
  const pv = view.multiplyNew(proj); // P * V

  // Apply perspective + view matrix to the CSS 3D scene
  const fPx = vh / 2 / Math.tan(fov / 2);
  viewport.style.perspective = `${fPx}px`;
  scene3d.style.transform = toCssMatrix(view);

  // Read theme colours from CSS custom properties
  const cs = getComputedStyle(document.documentElement);
  const colRed = cs.getPropertyValue("--red").trim();
  const colGreen = cs.getPropertyValue("--green").trim();
  const colPurple = cs.getPropertyValue("--purple").trim();

  // Axis lines (canvas)
  const origin = projectPoint(0, 0, 0, pv, vw, vh);
  const axisPts: [[number, number, number], string][] = [
    [[2, 0, 0], colRed],
    [[0, 2, 0], colGreen],
    [[0, 0, 2], colPurple],
  ];
  if (origin?.inFrustum) {
    for (const [[x, y, z], col] of axisPts) {
      const ap = projectPoint(x, y, z, pv, vw, vh);
      if (!ap?.inFrustum) continue;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(origin.sx, origin.sy);
      ctx.lineTo(ap.sx, ap.sy);
      ctx.stroke();
    }
  }

  // Look-at reticle: projected onto the cube centre (origin)
  if (origin?.inFrustum) {
    const { sx, sy } = origin;
    const r = 12;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = colGreen;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(sx - r, sy);
    ctx.lineTo(sx + r, sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx, sy - r);
    ctx.lineTo(sx, sy + r);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = colGreen;
    ctx.font = '11px "IBM Plex Mono"';
    ctx.textAlign = "left";
    ctx.fillText("lookat", sx + r + 3, sy + 3);
    ctx.restore();
  }

  // Floating axis labels
  LABELS.forEach((l, i) => {
    const pp = projectPoint(l.pos[0], l.pos[1], l.pos[2], pv, vw, vh);
    const el = labelEls[i];
    if (!pp || !pp.inFrustum) {
      el.style.display = "none";
      return;
    }
    const t = Math.max(0, Math.min(1, 1 - (pp.depth + 1) / 2));
    el.style.display = "block";
    el.style.transform = `translate(${pp.sx}px,${pp.sy}px) translate(-50%,-50%)`;
    el.style.opacity = String(0.35 + t * 0.65);
    el.style.fontSize = `${11 + t * 3}px`;
  });

  // Info panels
  quatBox.textContent = `q = { x: ${fmt3(q.x)}, y: ${fmt3(q.y)}, z: ${fmt3(q.z)}, w: ${fmt3(q.w)} }`;

  lookatBox.textContent = [
    `forward = { x: ${fmt3(forward.x)}, y: ${fmt3(forward.y)}, z: ${fmt3(forward.z)} }`,
    `eye     = { x: ${fmt3(eye.x)}, y: ${fmt3(eye.y)}, z: ${fmt3(eye.z)} }`,
  ].join("\n");

  codeBox.textContent = [
    `// Orbit: rotate default eye (0,0,r) by quaternion`,
    `const qYaw   = Quat.fromAxisAngle(new Vec3(0,1,0),  ${fmt2(yaw)});`,
    `const qPitch = Quat.fromAxisAngle(new Vec3(1,0,0), ${fmt2(-pitch)});`,
    `const q      = qYaw.multiplyNew(qPitch);`,
    `// { x:${fmt3(q.x)}, y:${fmt3(q.y)}, z:${fmt3(q.z)}, w:${fmt3(q.w)} }`,
    ``,
    `const rotMat = Mat4.fromQuat(q.array);`,
    `const eye    = new Vec3(0, 0, ${fmt2(radius)})`,
    `  .transformByMat4New(rotMat);`,
    `// { x:${fmt3(eye.x)}, y:${fmt3(eye.y)}, z:${fmt3(eye.z)} }`,
    ``,
    `// Look-at vector: eye -> origin`,
    `const target  = new Vec3(0, 0, 0);`,
    `const forward = target.subtractNew(eye).normaliseNew();`,
    `// { x:${fmt3(forward.x)}, y:${fmt3(forward.y)}, z:${fmt3(forward.z)} }`,
    ``,
    `// View matrix + CSS`,
    `const view = Mat4.lookAt(eye, target, [0,1,0]);`,
    `scene.style.transform = \`matrix3d(\${view.array})\`;`,
  ].join("\n");
}

// Controls wiring

type Key = keyof typeof sliders;

function wireSliderNum(key: Key, onChanged: (v: number) => void) {
  const s = sliders[key];
  const n = nums[key];
  s.addEventListener("input", () => {
    const v = parseFloat(s.value);
    n.value = String(v);
    onChanged(v);
    render();
  });
  n.addEventListener("change", () => {
    const v = parseFloat(n.value);
    s.value = String(v);
    onChanged(v);
    render();
  });
}

wireSliderNum("yaw", (v) => {
  yawDeg = v;
});
wireSliderNum("pitch", (v) => {
  pitchDeg = v;
});
wireSliderNum("radius", (v) => {
  radius = v;
});

window.addEventListener("resize", render);
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", render);

render();
