import { Vec3, Mat4, Quat } from '../src/index';

// ─── Constants ────────────────────────────────────────────────────────────────

const SCALE = 100; // px per world unit

// ─── Scene labels (axes + origin only — cube is now CSS) ──────────────────────

const LABELS: Array<{ pos: [number,number,number]; text: string; color: string }> = [
  { pos: [0,   0,   0   ], text: 'origin', color: 'rgba(255,255,255,0.55)' },
  { pos: [2.2, 0,   0   ], text: '+X',     color: '#ff5566' },
  { pos: [0,   2.2, 0   ], text: '+Y',     color: '#39ff8a' },
  { pos: [0,   0,   2.2 ], text: '+Z',     color: '#8866ff' },
];

// ─── State ────────────────────────────────────────────────────────────────────

let eyeX = 0, eyeY = 2, eyeZ = 5;
let yawDeg = 0, pitchDeg = -17;

// ─── DOM ──────────────────────────────────────────────────────────────────────

const viewport   = document.getElementById('viewport')!;
const scene3d    = document.getElementById('scene-3d')!;
const canvas     = document.getElementById('scene-canvas') as HTMLCanvasElement;
const quatBox    = document.getElementById('quat-box')!;
const lookatBox  = document.getElementById('lookat-box')!;
const codeBox    = document.getElementById('code-box')!;

function getEl<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

const sliders = {
  eyeX:  getEl<HTMLInputElement>('eyeX'),
  eyeY:  getEl<HTMLInputElement>('eyeY'),
  eyeZ:  getEl<HTMLInputElement>('eyeZ'),
  yaw:   getEl<HTMLInputElement>('yaw'),
  pitch: getEl<HTMLInputElement>('pitch'),
};
const nums = {
  eyeX:  getEl<HTMLInputElement>('eyeXn'),
  eyeY:  getEl<HTMLInputElement>('eyeYn'),
  eyeZ:  getEl<HTMLInputElement>('eyeZn'),
  yaw:   getEl<HTMLInputElement>('yawn'),
  pitch: getEl<HTMLInputElement>('pitchn'),
};

// Floating text labels (canvas-projected)
const labelEls = LABELS.map(l => {
  const el = document.createElement('div');
  el.className = 'pt-label';
  el.style.color = l.color;
  el.textContent = l.text;
  viewport.appendChild(el);
  return el;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt3 = (n: number) => n.toFixed(3);
const fmt2 = (n: number) => parseFloat(n.toFixed(2)).toString();

// Project a world-space point through the combined P*V matrix to screen pixels.
function projectPoint(
  wx: number, wy: number, wz: number,
  pv: Mat4,
  vw: number, vh: number,
) {
  const m = pv.array;
  const cx = m[0]*wx + m[4]*wy + m[8]*wz  + m[12];
  const cy = m[1]*wx + m[5]*wy + m[9]*wz  + m[13];
  const cz = m[2]*wx + m[6]*wy + m[10]*wz + m[14];
  const cw = m[3]*wx + m[7]*wy + m[11]*wz + m[15];

  if (cw < 0.01) return null;

  const ndcX = cx / cw;
  const ndcY = cy / cw;
  const ndcZ = cz / cw;

  return {
    sx: (ndcX * 0.5 + 0.5) * vw,
    sy: (1 - (ndcY * 0.5 + 0.5)) * vh,
    depth: ndcZ,
    inFrustum: ndcX > -1.2 && ndcX < 1.2 && ndcY > -1.2 && ndcY < 1.2 && ndcZ < 1,
  };
}

// Convert our row-major Mat4 (row-vector convention) to a CSS matrix3d string.
// CSS matrix3d is column-major column-vector, which is exactly the transpose of
// our matrix — and reading our row-major array directly IS the transpose.
// We also scale the translation components (a41/a42/a43 = m[12]/m[13]/m[14])
// from world units to CSS pixels.
function toCssMatrix(view: Mat4): string {
  const m = [...view.array];
  m[12] *= SCALE;
  m[13] *= SCALE;
  m[14] *= SCALE;
  return `matrix3d(${m.join(',')})`;
}

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (vw === 0 || vh === 0) return;

  // ── Canvas setup ──
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = vw * dpr;
  canvas.height = vh * dpr;
  canvas.style.width  = `${vw}px`;
  canvas.style.height = `${vh}px`;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, vw, vh);

  const yaw   = yawDeg   * Math.PI / 180;
  const pitch = pitchDeg * Math.PI / 180;

  // ── Build quaternion + view matrix ──
  const qYaw   = Quat.fromAxisAngle(new Vec3(0, 1, 0), yaw);
  const qPitch = Quat.fromAxisAngle(new Vec3(1, 0, 0), pitch);
  const q      = qYaw.multiplyNew(qPitch) as Quat;

  const rotMat  = Mat4.fromQuat(q.array)!;
  const forward = new Vec3(0, 0, -1).transformByMat4New(rotMat);

  const eye    = new Vec3(eyeX, eyeY, eyeZ);
  const target = eye.addNew(forward);

  const view = Mat4.lookAt(eye.array, target.array, [0, 1, 0])!;

  // ── CSS 3D cube: set perspective + apply view matrix ──
  // Perspective (px) matches our 60° FOV at the current viewport height.
  const fov  = Math.PI / 3;
  const fPx  = (vh / 2) / Math.tan(fov / 2);
  viewport.style.perspective = `${fPx}px`;
  scene3d.style.transform = toCssMatrix(view);

  // ── Math projection (for canvas overlays) ──
  const proj = Mat4.perspective(fov, vw / vh, 0.1, 60);
  const pv   = view.multiplyNew(proj);

  // ── Axis lines (canvas) ──
  const origin = projectPoint(0, 0, 0, pv, vw, vh);
  const axisPts: [[number,number,number], string][] = [
    [[2, 0, 0], '#ff5566'],
    [[0, 2, 0], '#39ff8a'],
    [[0, 0, 2], '#8866ff'],
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

  // ── Look-at vector: crosshair at projected target ──
  const projTarget = projectPoint(target.x, target.y, target.z, pv, vw, vh);
  if (projTarget?.inFrustum) {
    const { sx, sy } = projTarget;
    const r = 10;
    ctx.save();
    ctx.strokeStyle = 'rgba(57,255,138,0.7)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(sx - r, sy); ctx.lineTo(sx + r, sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx, sy - r); ctx.lineTo(sx, sy + r); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(57,255,138,0.5)';
    ctx.beginPath(); ctx.arc(sx, sy, r * 0.4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(57,255,138,0.6)';
    ctx.font = '9px "IBM Plex Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('lookat', sx + r + 3, sy + 3);
    ctx.restore();
  }

  // ── Floating labels (canvas-projected DOM) ──
  LABELS.forEach((l, i) => {
    const pp = projectPoint(l.pos[0], l.pos[1], l.pos[2], pv, vw, vh);
    const el = labelEls[i];
    if (!pp || !pp.inFrustum) { el.style.display = 'none'; return; }
    const t = Math.max(0, Math.min(1, 1 - (pp.depth + 1) / 2));
    el.style.display   = 'block';
    el.style.transform = `translate(${pp.sx}px,${pp.sy}px) translate(-50%,-50%)`;
    el.style.opacity   = String(0.35 + t * 0.65);
    el.style.fontSize  = `${9 + t * 3}px`;
  });

  // ── Info panels ──
  quatBox.textContent =
    `q = { x: ${fmt3(q.x)}, y: ${fmt3(q.y)}, z: ${fmt3(q.z)}, w: ${fmt3(q.w)} }`;

  lookatBox.textContent = [
    `forward = { x: ${fmt3(forward.x)}, y: ${fmt3(forward.y)}, z: ${fmt3(forward.z)} }`,
    `target  = { x: ${fmt3(target.x)}, y: ${fmt3(target.y)}, z: ${fmt3(target.z)} }`,
  ].join('\n');

  codeBox.textContent = [
    `const eye = new Vec3(${fmt2(eyeX)}, ${fmt2(eyeY)}, ${fmt2(eyeZ)});`,
    ``,
    `// Build orientation quaternion`,
    `const qYaw   = Quat.fromAxisAngle(new Vec3(0,1,0), ${fmt2(yaw)});`,
    `const qPitch = Quat.fromAxisAngle(new Vec3(1,0,0), ${fmt2(pitch)});`,
    `const q = qYaw.multiplyNew(qPitch);`,
    `// { x:${fmt3(q.x)}, y:${fmt3(q.y)}, z:${fmt3(q.z)}, w:${fmt3(q.w)} }`,
    ``,
    `// Look-at vector from quaternion`,
    `const rotMat  = Mat4.fromQuat(q.array);`,
    `const forward = new Vec3(0,0,-1).transformByMat4New(rotMat);`,
    `// { x:${fmt3(forward.x)}, y:${fmt3(forward.y)}, z:${fmt3(forward.z)} }`,
    `const target  = eye.addNew(forward);`,
    ``,
    `// View matrix → CSS matrix3d`,
    `const view = Mat4.lookAt(eye.array, target.array, [0,1,0]);`,
    `scene.style.transform = \`matrix3d(\${view.array.join(',')})\`;`,
  ].join('\n');
}

// ─── Controls wiring ─────────────────────────────────────────────────────────

type Key = keyof typeof sliders;

function wireSliderNum(key: Key, onChanged: (v: number) => void) {
  const s = sliders[key];
  const n = nums[key];
  s.addEventListener('input', () => {
    const v = parseFloat(s.value);
    n.value = String(v);
    onChanged(v);
    render();
  });
  n.addEventListener('change', () => {
    const v = parseFloat(n.value);
    s.value = String(v);
    onChanged(v);
    render();
  });
}

wireSliderNum('eyeX',  v => { eyeX     = v; });
wireSliderNum('eyeY',  v => { eyeY     = v; });
wireSliderNum('eyeZ',  v => { eyeZ     = v; });
wireSliderNum('yaw',   v => { yawDeg   = v; });
wireSliderNum('pitch', v => { pitchDeg = v; });

window.addEventListener('resize', render);

render();
