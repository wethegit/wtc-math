import { Vec3, Mat4, Quat } from "https://esm.sh/wtc-math@1.3.0";
import { Pane } from "https://esm.sh/tweakpane@4.0.5";

/*
Uses wtc-math - https://github.com/wethegit/wtc-math - to control
a 3D camera for CSS transformations.

1. Creates a quaternion from the provided yaw and pitch
2. Creates a transformation matrix from the quaternion
3. Adds the 3D transformation matrix to the associated CSS property

*/

console.clear();

// const SCALE = -50;

const PARAMS = { yaw: 30, pitch: 20, radius: 5 };

const viewport = document.getElementById("viewport");
const scene3d = document.getElementById("scene-3d");
const canvas = document.getElementById("scene-canvas");
const quatBox = document.getElementById("quat-box");
const lookatBox = document.getElementById("lookat-box");
const codeBox = document.getElementById("code-box");

const pane = new Pane({ title: "Camera Orbit" });
pane
  .addBinding(PARAMS, "yaw", { min: -180, max: 180, step: 1, label: "yaw °" })
  .on("change", scheduleRender);
pane
  .addBinding(PARAMS, "pitch", { min: -89, max: 89, step: 1, label: "pitch °" })
  .on("change", scheduleRender);
pane
  .addBinding(PARAMS, "radius", {
    min: 0.02,
    max: 12,
    step: 0.01,
    label: "radius",
  })
  .on("change", scheduleRender);

const fmt3 = (n) => n.toFixed(3);
const fmt2 = (n) => parseFloat(n.toFixed(2)).toString();

// CSS perspective = distance from CSS camera to the z=0 screen plane.
// For the mathematical camera to appear truly "inside" the cube, the front
// face must exceed perspectivePx in CSS z — i.e. it must pass behind the CSS
// camera and get clipped.  Front-face CSS z = halfFacePx - r * scale.
// With scale = halfFacePx the cube is exactly 1 world unit in half-extent, and
// the face clips when (1 - r) * halfFacePx > perspectivePx, i.e. r < 0.75.
const FOV = Math.PI / 2;
let scale = 1;
let cachedVw = 0;
let cachedVh = 0;
let rafPending = false;

function updateMetrics() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (!vw || !vh) return;

  const perspectivePx = vh / 2 / Math.tan(FOV / 2);
  const halfFacePx = perspectivePx * 4; // face clips at r < 0.75 world units
  scale = halfFacePx;                   // 1 world unit = halfFacePx px
  viewport.style.perspective = `${perspectivePx}px`;
  viewport.style.setProperty("--halfFaceSize", `${halfFacePx}px`);
  viewport.style.setProperty("--faceSize", `${halfFacePx * 2}px`);

  // Only resize the canvas when the viewport actually changes size.
  // Setting canvas.width inside a perspective 3D context forces a full
  // compositing-layer repaint even when the value is the same, which
  // causes the flicker during drag.
  if (vw !== cachedVw || vh !== cachedVh) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    canvas.style.width = `${vw}px`;
    canvas.style.height = `${vh}px`;
    cachedVw = vw;
    cachedVh = vh;
  }
}

function scheduleRender() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => { rafPending = false; render(); });
}

function toCssMatrix(view) {
  const m = [...view.array];
  m[12] *= scale;
  m[13] *= scale;
  m[14] *= scale;
  return `matrix3d(${m.join(",")})`;
}

function render() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (!vw || !vh) return;

  const yaw = (PARAMS.yaw * Math.PI) / 180;
  const pitch = (PARAMS.pitch * Math.PI) / 180;

  const qYaw = Quat.fromAxisAngle(new Vec3(0, 1, 0), yaw);
  const qPitch = Quat.fromAxisAngle(new Vec3(1, 0, 0), -pitch);
  const q = qYaw.multiplyNew(qPitch);

  const rotMat = Mat4.fromQuat(q.array);
  const eye = new Vec3(0, 0, PARAMS.radius).transformByMat4New(rotMat);
  const target = new Vec3(0, 0, 0);
  const forward = target.subtractNew(eye).normaliseNew();

  const view = Mat4.lookAt(eye, target, [0, 1, 0]);
  scene3d.style.transform = toCssMatrix(view);

  // Info
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
    `const eye    = new Vec3(0, 0, ${fmt2(PARAMS.radius)})`,
    `  .transformByMat4New(rotMat);`,
    `// { x:${fmt3(eye.x)}, y:${fmt3(eye.y)}, z:${fmt3(eye.z)} }`,
    ``,
    `const target  = new Vec3(0, 0, 0);`,
    `const forward = target.subtractNew(eye).normaliseNew();`,
    `// { x:${fmt3(forward.x)}, y:${fmt3(forward.y)}, z:${fmt3(forward.z)} }`,
    ``,
    `const view = Mat4.lookAt(eye, target, [0,1,0]);`,
    `scene.style.transform = \`matrix3d(\${view.join(',')})\`;`,
  ].join("\n");
}

const DRAG_SENSITIVITY = 0.4;
let isDragging = false;
let lastX = 0,
  lastY = 0;
viewport.addEventListener("pointerdown", (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  viewport.setPointerCapture(e.pointerId);
  viewport.style.cursor = "grabbing";
});
viewport.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;

  let newYaw = PARAMS.yaw + -dx * DRAG_SENSITIVITY;
  newYaw = ((((newYaw + 180) % 360) + 360) % 360) - 180;
  const newPitch = Math.max(
    -89,
    Math.min(89, PARAMS.pitch - dy * DRAG_SENSITIVITY),
  );

  PARAMS.yaw = newYaw;
  PARAMS.pitch = newPitch;

  pane.refresh();
  scheduleRender();
});

viewport.addEventListener("pointerup", (e) => {
  isDragging = false;
  viewport.releasePointerCapture(e.pointerId);
  viewport.style.cursor = "grab";
});

window.addEventListener("resize", () => { updateMetrics(); scheduleRender(); });
updateMetrics();
render();
