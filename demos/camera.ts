import { Vec3, Mat4, Quat } from '../src/index';

// ─── Scene ────────────────────────────────────────────────────────────────────

const CUBE_HALF = 1.4;
const H = CUBE_HALF;

const CUBE_VERTS: [number, number, number][] = [
  [-H, -H, -H], [ H, -H, -H], [ H,  H, -H], [-H,  H, -H],
  [-H, -H,  H], [ H, -H,  H], [ H,  H,  H], [-H,  H,  H],
];

const CUBE_EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7],
];

const LABELS: Array<{ pos: [number,number,number]; text: string; color: string }> = [
  { pos: [0,   0,   0   ], text: 'origin', color: 'rgba(255,255,255,0.6)' },
  { pos: [2.2, 0,   0   ], text: '+X',     color: '#ff5566' },
  { pos: [0,   2.2, 0   ], text: '+Y',     color: '#39ff8a' },
  { pos: [0,   0,   2.2 ], text: '+Z',     color: '#8866ff' },
  { pos: [H,   H,   H   ], text: '(1,1,1)', color: '#ffc940' },
  { pos: [-H,  H,  -H   ], text: '(-1,1,-1)', color: '#ffc940' },
];

// ─── State ────────────────────────────────────────────────────────────────────

let eyeX = 0, eyeY = 2, eyeZ = 5;
let yawDeg = 0, pitchDeg = -17;

// ─── DOM ──────────────────────────────────────────────────────────────────────

const viewport   = document.getElementById('viewport')!;
const canvas     = document.getElementById('scene-canvas') as HTMLCanvasElement;
const quatBox    = document.getElementById('quat-box')!;
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

// Build point-label DOM elements
const labelEls = LABELS.map(l => {
  const el = document.createElement('div');
  el.className = 'pt-label';
  el.style.color = l.color;
  el.textContent = l.text;
  viewport.appendChild(el);
  return el;
});

// ─── Math helpers ─────────────────────────────────────────────────────────────

function fmt3(n: number) { return n.toFixed(3); }
function fmt2(n: number) { return parseFloat(n.toFixed(2)).toString(); }

function projectPoint(
  wx: number, wy: number, wz: number,
  pv: Mat4,
  vw: number, vh: number,
) {
  const m = pv.array;
  const cx = m[0]*wx + m[4]*wy + m[8]*wz  + m[12];
  const cy = m[1]*wx + m[5]*wy + m[9]*wz  + m[13];
  const cw = m[3]*wx + m[7]*wy + m[11]*wz + m[15];
  const cz = m[2]*wx + m[6]*wy + m[10]*wz + m[14];

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

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (vw === 0 || vh === 0) return;

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

  // Build orientation quaternion
  const qYaw   = Quat.fromAxisAngle(new Vec3(0, 1, 0), yaw);
  const qPitch = Quat.fromAxisAngle(new Vec3(1, 0, 0), pitch);
  const q      = qYaw.multiplyNew(qPitch) as Quat;

  // Derive camera forward direction from quaternion
  const rotMat  = Mat4.fromQuat(q.array)!;
  const forward = new Vec3(0, 0, -1).transformByMat4New(rotMat);

  const eye    = new Vec3(eyeX, eyeY, eyeZ);
  const target = eye.addNew(forward);

  const view = Mat4.lookAt(eye.array, target.array, [0, 1, 0])!;
  const proj = Mat4.perspective(Math.PI / 3, vw / vh, 0.1, 60);

  // Combined projection-view matrix (P * V)
  const pv = view.multiplyNew(proj);

  // Project cube vertices
  const cv = CUBE_VERTS.map(([x,y,z]) => projectPoint(x, y, z, pv, vw, vh));

  // Draw cube wireframe
  ctx.lineWidth = 1;
  for (const [a, b] of CUBE_EDGES) {
    const pa = cv[a], pb = cv[b];
    if (!pa || !pb || !pa.inFrustum || !pb.inFrustum) continue;
    const avgDepth = (pa.depth + pb.depth) / 2;
    const alpha = Math.max(0, Math.min(0.5, 0.6 - avgDepth * 0.3));
    ctx.strokeStyle = `rgba(255, 201, 64, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(pa.sx, pa.sy);
    ctx.lineTo(pb.sx, pb.sy);
    ctx.stroke();
  }

  // Draw axis lines from origin
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

  // Update floating label DOM elements
  LABELS.forEach((l, i) => {
    const pp = projectPoint(l.pos[0], l.pos[1], l.pos[2], pv, vw, vh);
    const el = labelEls[i];
    if (!pp || !pp.inFrustum) {
      el.style.display = 'none';
      return;
    }
    const t = Math.max(0, Math.min(1, 1 - (pp.depth + 1) / 2));
    el.style.display  = 'block';
    el.style.transform = `translate(${pp.sx}px, ${pp.sy}px) translate(-50%, -50%)`;
    el.style.opacity  = String(0.35 + t * 0.65);
    el.style.fontSize = `${9 + t * 3}px`;
  });

  // Quat display
  quatBox.textContent =
    `q = { x: ${fmt3(q.x)}, y: ${fmt3(q.y)}, z: ${fmt3(q.z)}, w: ${fmt3(q.w)} }`;

  // Live code
  const ex = eyeX === 0 && eyeY === 2 && eyeZ === 5;
  codeBox.textContent = [
    `const eye = new Vec3(${fmt2(eyeX)}, ${fmt2(eyeY)}, ${fmt2(eyeZ)});`,
    ``,
    `// Build orientation quaternion`,
    `const qYaw   = Quat.fromAxisAngle(`,
    `  new Vec3(0, 1, 0), ${fmt2(yaw)} /* ${yawDeg}° */`,
    `);`,
    `const qPitch = Quat.fromAxisAngle(`,
    `  new Vec3(1, 0, 0), ${fmt2(pitch)} /* ${pitchDeg}° */`,
    `);`,
    `const q = qYaw.multiplyNew(qPitch);`,
    `// { x:${fmt3(q.x)}, y:${fmt3(q.y)}, z:${fmt3(q.z)}, w:${fmt3(q.w)} }`,
    ``,
    `// Derive forward direction from q`,
    `const rotMat  = Mat4.fromQuat(q.array);`,
    `const forward = new Vec3(0, 0, -1)`,
    `  .transformByMat4New(rotMat);`,
    `const target  = eye.addNew(forward);`,
    ``,
    `// Build view matrix`,
    `const view = Mat4.lookAt(eye.array, target.array, [0,1,0]);`,
    `const proj = Mat4.perspective(Math.PI/3, aspect, 0.1, 60);`,
    `const pv   = view.multiplyNew(proj); // P * V`,
    ``,
    `// Project and apply as CSS transform`,
    `const { sx, sy } = project(worldPoint, pv, w, h);`,
    `el.style.transform = \`translate(\${sx}px, \${sy}px)\`;`,
  ].join('\n');
}

// ─── Controls wiring ─────────────────────────────────────────────────────────

type Key = keyof typeof sliders;

function wireSliderNum(
  key: Key,
  onChanged: (v: number) => void,
) {
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

wireSliderNum('eyeX',  v => { eyeX   = v; });
wireSliderNum('eyeY',  v => { eyeY   = v; });
wireSliderNum('eyeZ',  v => { eyeZ   = v; });
wireSliderNum('yaw',   v => { yawDeg = v; });
wireSliderNum('pitch', v => { pitchDeg = v; });

window.addEventListener('resize', render);

render();
