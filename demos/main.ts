import { Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, Quat } from '../src/index';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Input {
  label: string;
  name:  string;
  value: number;
  min:   number;
  max:   number;
  step:  number;
}

interface Example {
  id:         string;
  title:      string;
  inputs:     Input[];
  preview:    (v: Record<string, number>) => string;
  compute:    (v: Record<string, number>) => unknown;
  visualize:  (ctx: CanvasRenderingContext2D, size: number, v: Record<string, number>) => void;
  legend?:    Array<{ label: string; color: string }>;
}

interface Tab {
  name:        string;
  description: string;
  placeholder: string;
  examples:    Example[];
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const P = {
  green:  '#39ff8a',
  purple: '#8866ff',
  amber:  '#ffc940',
  dim:    'rgba(255,255,255,0.07)',
  axis:   'rgba(255,255,255,0.14)',
  grid:   'rgba(255,255,255,0.04)',
  bg:     '#07080c',
};

// ─── Canvas Utilities ─────────────────────────────────────────────────────────

function setupCanvas(canvas: HTMLCanvasElement) {
  const wrap = canvas.parentElement!;
  const size = Math.min(wrap.clientWidth - 32, wrap.clientHeight - 32);
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width  = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return { ctx, size };
}

function n2(v: number) {
  const s = parseFloat(v.toFixed(2)).toString();
  return s;
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
  const cx = size / 2, cy = size / 2;
  const unit = size / 10;

  ctx.clearRect(0, 0, size, size);

  // minor grid
  ctx.strokeStyle = P.grid;
  ctx.lineWidth = 1;
  for (let i = -6; i <= 6; i++) {
    ctx.beginPath(); ctx.moveTo(cx + i * unit, 0); ctx.lineTo(cx + i * unit, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy + i * unit); ctx.lineTo(size, cy + i * unit); ctx.stroke();
  }

  // axes
  ctx.strokeStyle = P.axis;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(size, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, size); ctx.stroke();

  // axis labels
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = '9px "IBM Plex Mono"';
  ctx.textAlign = 'right';
  ctx.fillText('+x', size - 3, cy - 4);
  ctx.textAlign = 'left';
  ctx.fillText('+y', cx + 4, 11);

  return { cx, cy, unit };
}

function arrow(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  tx: number, ty: number,
  color: string,
  glow = true
) {
  if (Math.abs(tx - ox) < 0.5 && Math.abs(ty - oy) < 0.5) return;

  ctx.save();
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }

  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = 1.5;

  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  const angle   = Math.atan2(ty - oy, tx - ox);
  const headLen = 8;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - headLen * Math.cos(angle - 0.42), ty - headLen * Math.sin(angle - 0.42));
  ctx.lineTo(tx - headLen * Math.cos(angle + 0.42), ty - headLen * Math.sin(angle + 0.42));
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function label(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  text: string,
  color: string
) {
  ctx.fillStyle = color;
  ctx.font = '10px "IBM Plex Mono"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x + 5, y - 5);
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 4) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur  = 12;
  ctx.fillStyle   = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── Vec3 Isometric ──────────────────────────────────────────────────────────

const ISO_X: [number, number] = [Math.sqrt(3) / 2,  0.5];
const ISO_Y: [number, number] = [0,                 -1  ];
const ISO_Z: [number, number] = [-Math.sqrt(3) / 2,  0.5];

function toIso(x: number, y: number, z: number, scale: number): [number, number] {
  return [
    (x * ISO_X[0] + y * ISO_Y[0] + z * ISO_Z[0]) * scale,
    (x * ISO_X[1] + y * ISO_Y[1] + z * ISO_Z[1]) * scale,
  ];
}

interface IsoVector { x: number; y: number; z: number; color: string; label: string; }

function drawIso(ctx: CanvasRenderingContext2D, size: number, vectors: IsoVector[]) {
  const cx = size / 2, cy = size * 0.55;
  const scale = size / 9;

  ctx.clearRect(0, 0, size, size);

  // Axis lines
  const axLen = 3.2;
  [
    { v: [axLen, 0, 0] as [number,number,number], c: 'rgba(255,255,255,0.12)', t: 'x' },
    { v: [0, axLen, 0] as [number,number,number], c: 'rgba(255,255,255,0.12)', t: 'y' },
    { v: [0, 0, axLen] as [number,number,number], c: 'rgba(255,255,255,0.12)', t: 'z' },
  ].forEach(({ v, c, t }) => {
    const [sx, sy] = toIso(...v, scale);
    ctx.strokeStyle = c;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + sx, cy + sy);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px "IBM Plex Mono"';
    ctx.fillText(t, cx + sx + 4, cy + sy + 4);
  });

  // Vectors
  vectors.forEach(vec => {
    const [sx, sy] = toIso(vec.x, vec.y, vec.z, scale);
    arrow(ctx, cx, cy, cx + sx, cy + sy, vec.color);
    label(ctx, cx + sx, cy + sy, vec.label, vec.color);
  });
}

// ─── Matrix Grid ──────────────────────────────────────────────────────────────

function drawMatrixGrid(
  ctx: CanvasRenderingContext2D,
  size: number,
  values: number[],
  rows: number,
  cols: number
) {
  ctx.clearRect(0, 0, size, size);

  const pad   = 20;
  const cellW = (size - pad * 2) / cols;
  const cellH = Math.min((size - pad * 2) / rows, cellW);
  const startX = pad;
  const startY = (size - cellH * rows) / 2;

  const maxAbs = Math.max(...values.map(Math.abs), 0.0001);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v  = values[r * cols + c];
      const t  = v / maxAbs;
      const x  = startX + c * cellW;
      const y  = startY + r * cellH;

      // Background
      const alpha = Math.min(Math.abs(t) * 0.18, 0.18);
      ctx.fillStyle = t > 0
        ? `rgba(57,255,138,${alpha})`
        : t < 0
        ? `rgba(136,102,255,${alpha})`
        : 'rgba(255,255,255,0.02)';
      ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth   = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);

      // Value
      const isZero = Math.abs(v) < 0.0001;
      ctx.fillStyle = isZero
        ? 'rgba(255,255,255,0.2)'
        : t > 0
        ? P.green
        : P.purple;
      ctx.font          = `${Math.min(cellW * 0.28, 13)}px "IBM Plex Mono"`;
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';
      const disp = isZero ? '0' : parseFloat(v.toFixed(3)).toString();
      ctx.fillText(disp, x + cellW / 2, y + cellH / 2);
    }
  }

  ctx.textAlign    = 'left';
  ctx.textBaseline = 'alphabetic';
}

// ─── Result Formatter ─────────────────────────────────────────────────────────

function fmt(v: number) {
  return parseFloat(v.toFixed(4)).toString();
}

function formatResult(v: unknown): string {
  if (v === null || v === undefined) return String(v);
  if (typeof v === 'number')  return fmt(v);
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'string')  return `"${v}"`;

  const o = v as Record<string, unknown>;

  // Detect by available components
  if (typeof o.x === 'number' && typeof o.y === 'number') {
    if (typeof o.z === 'number' && typeof o.w === 'number')
      return `{ x:${fmt(o.x)}, y:${fmt(o.y)}, z:${fmt(o.z)}, w:${fmt(o.w)} }`;
    if (typeof o.z === 'number')
      return `{ x:${fmt(o.x)}, y:${fmt(o.y)}, z:${fmt(o.z)} }`;
    return `{ x:${fmt(o.x)}, y:${fmt(o.y)} }`;
  }

  if (Array.isArray(o.array))
    return `[ ${(o.array as number[]).map(fmt).join(', ')} ]`;

  return JSON.stringify(v);
}

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const TABS: Tab[] = [

  // ─── Vec2 ────────────────────────────────────────────────────────────────
  {
    name: 'Vec2',
    description: '2D vector — x, y components. Supports add, subtract, scale, rotate, dot product, and lerp.',
    placeholder: "new Vec2(1, 2).addNew(new Vec2(3, 4))",
    examples: [

      {
        id: 'v2-add',
        title: 'Add',
        inputs: [
          { label: 'a.x', name: 'ax', value:  2,  min: -5, max: 5, step: 0.1 },
          { label: 'a.y', name: 'ay', value:  1,  min: -5, max: 5, step: 0.1 },
          { label: 'b.x', name: 'bx', value: -1,  min: -5, max: 5, step: 0.1 },
          { label: 'b.y', name: 'by', value:  3,  min: -5, max: 5, step: 0.1 },
        ],
        preview:  (v) => `new Vec2(${v.ax},${v.ay}).addNew(new Vec2(${v.bx},${v.by}))`,
        compute:  (v) => new Vec2(v.ax, v.ay).addNew(new Vec2(v.bx, v.by)),
        legend: [
          { label: 'a', color: P.green },
          { label: 'b', color: P.purple },
          { label: 'a + b', color: P.amber },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          const [rx, ry] = [v.ax + v.bx, v.ay + v.by];

          // Parallelogram ghost lines
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx + v.ax*u, cy - v.ay*u); ctx.lineTo(cx + rx*u, cy - ry*u); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx + v.bx*u, cy - v.by*u); ctx.lineTo(cx + rx*u, cy - ry*u); ctx.stroke();
          ctx.setLineDash([]);

          arrow(ctx, cx, cy, cx + v.ax*u, cy - v.ay*u, P.green);
          arrow(ctx, cx, cy, cx + v.bx*u, cy - v.by*u, P.purple);
          arrow(ctx, cx, cy, cx + rx*u,   cy - ry*u,   P.amber);

          label(ctx, cx + v.ax*u, cy - v.ay*u, `a`, P.green);
          label(ctx, cx + v.bx*u, cy - v.by*u, `b`, P.purple);
          label(ctx, cx + rx*u,   cy - ry*u,   `a+b`, P.amber);
        },
      },

      {
        id: 'v2-scale',
        title: 'Scale',
        inputs: [
          { label: 'x', name: 'x', value:  2,   min: -4, max: 4, step: 0.1 },
          { label: 'y', name: 'y', value:  1,   min: -4, max: 4, step: 0.1 },
          { label: 's', name: 's', value:  2,   min: -4, max: 4, step: 0.1 },
        ],
        preview:  (v) => `new Vec2(${v.x},${v.y}).scaleNew(${v.s})`,
        compute:  (v) => new Vec2(v.x, v.y).scaleNew(v.s),
        legend: [
          { label: 'v', color: P.green },
          { label: 'v × s', color: P.amber },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          arrow(ctx, cx, cy, cx + v.x*u, cy - v.y*u, P.green);
          arrow(ctx, cx, cy, cx + v.x*v.s*u, cy - v.y*v.s*u, P.amber);
          label(ctx, cx + v.x*u, cy - v.y*u, `v`, P.green);
          label(ctx, cx + v.x*v.s*u, cy - v.y*v.s*u, `v×${n2(v.s)}`, P.amber);
        },
      },

      {
        id: 'v2-dot',
        title: 'Dot Product',
        inputs: [
          { label: 'a.x', name: 'ax', value:  1,   min: -4, max: 4, step: 0.1 },
          { label: 'a.y', name: 'ay', value:  0,   min: -4, max: 4, step: 0.1 },
          { label: 'b.x', name: 'bx', value:  0.7, min: -4, max: 4, step: 0.1 },
          { label: 'b.y', name: 'by', value:  0.7, min: -4, max: 4, step: 0.1 },
        ],
        preview:  (v) => `new Vec2(${v.ax},${v.ay}).dot(new Vec2(${v.bx},${v.by}))`,
        compute:  (v) => new Vec2(v.ax, v.ay).dot(new Vec2(v.bx, v.by)),
        legend: [
          { label: 'a', color: P.green },
          { label: 'b', color: P.purple },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          const a = new Vec2(v.ax, v.ay);
          const b = new Vec2(v.bx, v.by);
          const d = a.dot(b);

          arrow(ctx, cx, cy, cx + v.ax*u, cy - v.ay*u, P.green);
          arrow(ctx, cx, cy, cx + v.bx*u, cy - v.by*u, P.purple);

          // Angle arc
          const ang1 = Math.atan2(-v.ay, v.ax);
          const ang2 = Math.atan2(-v.by, v.bx);
          ctx.save();
          ctx.strokeStyle = P.amber;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, 22, Math.min(ang1, ang2), Math.max(ang1, ang2));
          ctx.stroke();
          ctx.restore();

          label(ctx, cx + v.ax*u, cy - v.ay*u, 'a', P.green);
          label(ctx, cx + v.bx*u, cy - v.by*u, 'b', P.purple);

          ctx.fillStyle = P.amber;
          ctx.font = '11px "IBM Plex Mono"';
          ctx.textAlign = 'left';
          ctx.fillText(`· = ${fmt(d)}`, cx + 26, cy - 26);
        },
      },

      {
        id: 'v2-rotate',
        title: 'Rotate',
        inputs: [
          { label: 'x',   name: 'x',   value: 2,  min: -4,   max: 4,   step: 0.1 },
          { label: 'y',   name: 'y',   value: 0,  min: -4,   max: 4,   step: 0.1 },
          { label: 'deg', name: 'deg', value: 45, min: -360, max: 360, step: 1   },
        ],
        preview:  (v) => `new Vec2(${v.x},${v.y}).rotateNew(${v.deg}*Math.PI/180)`,
        compute:  (v) => new Vec2(v.x, v.y).rotateNew(v.deg * Math.PI / 180),
        legend: [
          { label: 'original', color: P.green },
          { label: 'rotated',  color: P.amber  },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          const r = new Vec2(v.x, v.y).rotateNew(v.deg * Math.PI / 180);

          // Arc
          const len  = Math.sqrt(v.x**2 + v.y**2);
          const ang0 = Math.atan2(-v.y, v.x);
          const ang1 = ang0 - v.deg * Math.PI / 180;
          ctx.save();
          ctx.strokeStyle = 'rgba(255,201,64,0.3)';
          ctx.lineWidth   = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          const [as, ae] = ang1 < ang0 ? [ang1, ang0] : [ang0, ang1];
          ctx.arc(cx, cy, len * u, as, ae);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          arrow(ctx, cx, cy, cx + v.x*u, cy - v.y*u, P.green);
          arrow(ctx, cx, cy, cx + r.x*u, cy - r.y*u, P.amber);
          label(ctx, cx + v.x*u, cy - v.y*u, 'v', P.green);
          label(ctx, cx + r.x*u, cy - r.y*u, `${v.deg}°`, P.amber);
        },
      },

      {
        id: 'v2-lerp',
        title: 'Lerp',
        inputs: [
          { label: 'a.x', name: 'ax', value: -2,  min: -4, max: 4,  step: 0.1  },
          { label: 'a.y', name: 'ay', value: -1,  min: -4, max: 4,  step: 0.1  },
          { label: 'b.x', name: 'bx', value:  3,  min: -4, max: 4,  step: 0.1  },
          { label: 'b.y', name: 'by', value:  2,  min: -4, max: 4,  step: 0.1  },
          { label: 't',   name: 't',  value:  0.5, min: 0,  max: 1, step: 0.01 },
        ],
        preview:  (v) => `Vec2.lerp(new Vec2(${v.ax},${v.ay}), new Vec2(${v.bx},${v.by}), ${v.t})`,
        compute:  (v) => Vec2.lerp(new Vec2(v.ax, v.ay), new Vec2(v.bx, v.by), v.t),
        legend: [
          { label: 'a',    color: P.green  },
          { label: 'b',    color: P.purple },
          { label: `t`,    color: P.amber  },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          const r = Vec2.lerp(new Vec2(v.ax, v.ay), new Vec2(v.bx, v.by), v.t);

          ctx.setLineDash([4, 5]);
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + v.ax*u, cy - v.ay*u);
          ctx.lineTo(cx + v.bx*u, cy - v.by*u);
          ctx.stroke();
          ctx.setLineDash([]);

          dot(ctx, cx + v.ax*u, cy - v.ay*u, P.green,  5);
          dot(ctx, cx + v.bx*u, cy - v.by*u, P.purple, 5);
          dot(ctx, cx + r.x*u,  cy - r.y*u,  P.amber,  6);

          label(ctx, cx + v.ax*u, cy - v.ay*u, 'a', P.green);
          label(ctx, cx + v.bx*u, cy - v.by*u, 'b', P.purple);
          label(ctx, cx + r.x*u,  cy - r.y*u,  `t=${v.t}`, P.amber);
        },
      },
    ],
  },

  // ─── Vec3 ────────────────────────────────────────────────────────────────
  {
    name: 'Vec3',
    description: '3D vector — x, y, z components. Supports cross product, dot product, normalise, lerp.',
    placeholder: "new Vec3(1,0,0).crossNew(new Vec3(0,1,0))",
    examples: [

      {
        id: 'v3-add',
        title: 'Add',
        inputs: [
          { label: 'a.x', name: 'ax', value:  1, min: -3, max: 3, step: 0.1 },
          { label: 'a.y', name: 'ay', value:  2, min: -3, max: 3, step: 0.1 },
          { label: 'a.z', name: 'az', value:  0, min: -3, max: 3, step: 0.1 },
          { label: 'b.x', name: 'bx', value:  1, min: -3, max: 3, step: 0.1 },
          { label: 'b.y', name: 'by', value: -1, min: -3, max: 3, step: 0.1 },
          { label: 'b.z', name: 'bz', value:  2, min: -3, max: 3, step: 0.1 },
        ],
        preview:  (v) => `new Vec3(${v.ax},${v.ay},${v.az}).addNew(new Vec3(${v.bx},${v.by},${v.bz}))`,
        compute:  (v) => new Vec3(v.ax, v.ay, v.az).addNew(new Vec3(v.bx, v.by, v.bz)),
        legend: [
          { label: 'a', color: P.green },
          { label: 'b', color: P.purple },
          { label: 'a + b', color: P.amber },
        ],
        visualize(ctx, size, v) {
          drawIso(ctx, size, [
            { x: v.ax, y: v.ay, z: v.az, color: P.green,  label: 'a' },
            { x: v.bx, y: v.by, z: v.bz, color: P.purple, label: 'b' },
            { x: v.ax+v.bx, y: v.ay+v.by, z: v.az+v.bz, color: P.amber, label: 'a+b' },
          ]);
        },
      },

      {
        id: 'v3-cross',
        title: 'Cross Product',
        inputs: [
          { label: 'a.x', name: 'ax', value:  1, min: -3, max: 3, step: 0.1 },
          { label: 'a.y', name: 'ay', value:  0, min: -3, max: 3, step: 0.1 },
          { label: 'a.z', name: 'az', value:  0, min: -3, max: 3, step: 0.1 },
          { label: 'b.x', name: 'bx', value:  0, min: -3, max: 3, step: 0.1 },
          { label: 'b.y', name: 'by', value:  1, min: -3, max: 3, step: 0.1 },
          { label: 'b.z', name: 'bz', value:  0, min: -3, max: 3, step: 0.1 },
        ],
        preview:  (v) => `new Vec3(${v.ax},${v.ay},${v.az}).crossNew(new Vec3(${v.bx},${v.by},${v.bz}))`,
        compute:  (v) => new Vec3(v.ax, v.ay, v.az).crossNew(new Vec3(v.bx, v.by, v.bz)),
        legend: [
          { label: 'a',   color: P.green  },
          { label: 'b',   color: P.purple },
          { label: 'a×b', color: P.amber  },
        ],
        visualize(ctx, size, v) {
          const c = new Vec3(v.ax, v.ay, v.az).crossNew(new Vec3(v.bx, v.by, v.bz));
          drawIso(ctx, size, [
            { x: v.ax, y: v.ay, z: v.az, color: P.green,  label: 'a' },
            { x: v.bx, y: v.by, z: v.bz, color: P.purple, label: 'b' },
            { x: c.x,  y: c.y,  z: c.z,  color: P.amber,  label: 'a×b' },
          ]);
        },
      },

      {
        id: 'v3-normalise',
        title: 'Normalise',
        inputs: [
          { label: 'x', name: 'x', value: 3, min: -5, max: 5, step: 0.1 },
          { label: 'y', name: 'y', value: 1, min: -5, max: 5, step: 0.1 },
          { label: 'z', name: 'z', value: 2, min: -5, max: 5, step: 0.1 },
        ],
        preview:  (v) => `new Vec3(${v.x},${v.y},${v.z}).normaliseNew()`,
        compute:  (v) => new Vec3(v.x, v.y, v.z).normaliseNew(),
        legend: [
          { label: 'v',   color: P.green },
          { label: 'n̂',   color: P.amber },
        ],
        visualize(ctx, size, v) {
          const n = new Vec3(v.x, v.y, v.z).normaliseNew();
          drawIso(ctx, size, [
            { x: v.x, y: v.y, z: v.z, color: P.green, label: 'v' },
            { x: n.x, y: n.y, z: n.z, color: P.amber, label: '|v|=1' },
          ]);
        },
      },

      {
        id: 'v3-dot',
        title: 'Dot Product',
        inputs: [
          { label: 'a.x', name: 'ax', value:  1, min: -3, max: 3, step: 0.1 },
          { label: 'a.y', name: 'ay', value:  0, min: -3, max: 3, step: 0.1 },
          { label: 'a.z', name: 'az', value:  0, min: -3, max: 3, step: 0.1 },
          { label: 'b.x', name: 'bx', value:  0.5, min: -3, max: 3, step: 0.1 },
          { label: 'b.y', name: 'by', value:  0.5, min: -3, max: 3, step: 0.1 },
          { label: 'b.z', name: 'bz', value:  0.7, min: -3, max: 3, step: 0.1 },
        ],
        preview:  (v) => `new Vec3(${v.ax},${v.ay},${v.az}).dot(new Vec3(${v.bx},${v.by},${v.bz}))`,
        compute:  (v) => new Vec3(v.ax, v.ay, v.az).dot(new Vec3(v.bx, v.by, v.bz)),
        legend: [
          { label: 'a', color: P.green  },
          { label: 'b', color: P.purple },
        ],
        visualize(ctx, size, v) {
          drawIso(ctx, size, [
            { x: v.ax, y: v.ay, z: v.az, color: P.green,  label: 'a' },
            { x: v.bx, y: v.by, z: v.bz, color: P.purple, label: 'b' },
          ]);
        },
      },
    ],
  },

  // ─── Vec4 ────────────────────────────────────────────────────────────────
  {
    name: 'Vec4',
    description: '4D vector — x, y, z, w components. Basis for quaternions and homogeneous coordinates.',
    placeholder: "new Vec4(1,2,3,1).addNew(new Vec4(0,1,0,0))",
    examples: [

      {
        id: 'v4-create',
        title: 'Create',
        inputs: [
          { label: 'x', name: 'x', value: 1, min: -4, max: 4, step: 0.1 },
          { label: 'y', name: 'y', value: 2, min: -4, max: 4, step: 0.1 },
          { label: 'z', name: 'z', value: 3, min: -4, max: 4, step: 0.1 },
          { label: 'w', name: 'w', value: 1, min: -4, max: 4, step: 0.1 },
        ],
        preview:  (v) => `new Vec4(${v.x},${v.y},${v.z},${v.w})`,
        compute:  (v) => new Vec4(v.x, v.y, v.z, v.w),
        visualize(ctx, size, v) {
          drawMatrixGrid(ctx, size, [v.x, v.y, v.z, v.w], 1, 4);
        },
      },

      {
        id: 'v4-add',
        title: 'Add',
        inputs: [
          { label: 'a.x', name: 'ax', value:  1, min: -4, max: 4, step: 0.1 },
          { label: 'a.y', name: 'ay', value:  2, min: -4, max: 4, step: 0.1 },
          { label: 'a.z', name: 'az', value:  3, min: -4, max: 4, step: 0.1 },
          { label: 'a.w', name: 'aw', value:  0, min: -4, max: 4, step: 0.1 },
          { label: 'b.x', name: 'bx', value: -1, min: -4, max: 4, step: 0.1 },
          { label: 'b.y', name: 'by', value:  1, min: -4, max: 4, step: 0.1 },
          { label: 'b.z', name: 'bz', value: -1, min: -4, max: 4, step: 0.1 },
          { label: 'b.w', name: 'bw', value:  1, min: -4, max: 4, step: 0.1 },
        ],
        preview:  (v) => `new Vec4(${v.ax},${v.ay},${v.az},${v.aw}).addNew(new Vec4(${v.bx},${v.by},${v.bz},${v.bw}))`,
        compute:  (v) => new Vec4(v.ax, v.ay, v.az, v.aw).addNew(new Vec4(v.bx, v.by, v.bz, v.bw)),
        visualize(ctx, size, v) {
          const r = new Vec4(v.ax, v.ay, v.az, v.aw).addNew(new Vec4(v.bx, v.by, v.bz, v.bw));
          drawMatrixGrid(ctx, size, [
            v.ax, v.ay, v.az, v.aw,
            v.bx, v.by, v.bz, v.bw,
            r.x,  r.y,  r.z,  r.w,
          ], 3, 4);
        },
      },
    ],
  },

  // ─── Mat2 ────────────────────────────────────────────────────────────────
  {
    name: 'Mat2',
    description: '2×2 matrix — rotation, scaling in 2D. Can transform Vec2 via transformByMat2.',
    placeholder: "Mat2.fromAngle(Math.PI / 4)",
    examples: [

      {
        id: 'm2-identity',
        title: 'Identity',
        inputs: [],
        preview:  () => `Mat2.identity()`,
        compute:  () => Mat2.identity(),
        visualize(ctx, size) {
          drawMatrixGrid(ctx, size, Mat2.identity().array, 2, 2);
        },
      },

      {
        id: 'm2-rotate',
        title: 'Rotation',
        inputs: [
          { label: 'angle (°)', name: 'deg', value: 45, min: -180, max: 180, step: 1 },
        ],
        preview:  (v) => `Mat2.fromAngle(${v.deg} * Math.PI / 180)`,
        compute:  (v) => Mat2.fromAngle(v.deg * Math.PI / 180),
        visualize(ctx, size, v) {
          drawMatrixGrid(ctx, size, Mat2.fromAngle(v.deg * Math.PI / 180).array, 2, 2);
        },
      },

      {
        id: 'm2-transform',
        title: 'Transform Vec2',
        inputs: [
          { label: 'v.x',      name: 'vx',  value:  2,  min: -4,   max: 4,   step: 0.1 },
          { label: 'v.y',      name: 'vy',  value:  0,  min: -4,   max: 4,   step: 0.1 },
          { label: 'angle (°)', name: 'deg', value: 45, min: -180, max: 180, step: 1   },
        ],
        preview:  (v) => `new Vec2(${v.vx},${v.vy}).transformByMat2(Mat2.fromAngle(${v.deg}*Math.PI/180))`,
        compute:  (v) => {
          const m = Mat2.fromAngle(v.deg * Math.PI / 180);
          return new Vec2(v.vx, v.vy).transformByMat2New(m);
        },
        legend: [
          { label: 'original',    color: P.green },
          { label: 'transformed', color: P.amber },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          const m = Mat2.fromAngle(v.deg * Math.PI / 180);
          const r = new Vec2(v.vx, v.vy).transformByMat2New(m);
          arrow(ctx, cx, cy, cx + v.vx*u, cy - v.vy*u, P.green);
          arrow(ctx, cx, cy, cx + r.x*u,  cy - r.y*u,  P.amber);
          label(ctx, cx + v.vx*u, cy - v.vy*u, 'v', P.green);
          label(ctx, cx + r.x*u,  cy - r.y*u,  `v'`, P.amber);
        },
      },
    ],
  },

  // ─── Mat3 ────────────────────────────────────────────────────────────────
  {
    name: 'Mat3',
    description: '3×3 matrix — 2D transforms with translation, or normal matrices for 3D.',
    placeholder: "Mat3.identity()",
    examples: [

      {
        id: 'm3-identity',
        title: 'Identity',
        inputs: [],
        preview:  () => `Mat3.identity()`,
        compute:  () => Mat3.identity(),
        visualize(ctx, size) {
          drawMatrixGrid(ctx, size, Mat3.identity().array, 3, 3);
        },
      },

      {
        id: 'm3-transform-v2',
        title: 'Transform Vec2',
        inputs: [
          { label: 'v.x',      name: 'vx',  value:  2,  min: -4,   max: 4,   step: 0.1 },
          { label: 'v.y',      name: 'vy',  value:  1,  min: -4,   max: 4,   step: 0.1 },
          { label: 'angle (°)', name: 'deg', value: 30, min: -180, max: 180, step: 1   },
          { label: 'tx',       name: 'tx',  value:  1,  min: -4,   max: 4,   step: 0.1 },
          { label: 'ty',       name: 'ty',  value:  0,  min: -4,   max: 4,   step: 0.1 },
        ],
        preview:  (v) => `new Vec2(${v.vx},${v.vy}).transformByMat3(mat3)`,
        compute:  (v) => {
          const r = v.deg * Math.PI / 180;
          const c = Math.cos(r), s = Math.sin(r);
          const m = new Mat3(c, s, 0, -s, c, 0, v.tx, v.ty, 1);
          return new Vec2(v.vx, v.vy).transformByMat3New(m);
        },
        legend: [
          { label: 'original',    color: P.green },
          { label: 'transformed', color: P.amber },
        ],
        visualize(ctx, size, v) {
          const { cx, cy, unit: u } = drawGrid(ctx, size);
          const r = v.deg * Math.PI / 180;
          const c = Math.cos(r), s = Math.sin(r);
          const m = new Mat3(c, s, 0, -s, c, 0, v.tx, v.ty, 1);
          const res = new Vec2(v.vx, v.vy).transformByMat3New(m);
          arrow(ctx, cx, cy, cx + v.vx*u, cy - v.vy*u, P.green);
          arrow(ctx, cx, cy, cx + res.x*u, cy - res.y*u, P.amber);
          label(ctx, cx + v.vx*u, cy - v.vy*u, 'v', P.green);
          label(ctx, cx + res.x*u, cy - res.y*u, `v'`, P.amber);
        },
      },
    ],
  },

  // ─── Mat4 ────────────────────────────────────────────────────────────────
  {
    name: 'Mat4',
    description: '4×4 matrix — 3D transforms, perspective projection, view matrices.',
    placeholder: "Mat4.perspective(Math.PI/3, 16/9, 0.1, 100)",
    examples: [

      {
        id: 'm4-identity',
        title: 'Identity',
        inputs: [],
        preview:  () => `new Mat4()`,
        compute:  () => new Mat4(),
        visualize(ctx, size) {
          drawMatrixGrid(ctx, size, new Mat4().array, 4, 4);
        },
      },

      {
        id: 'm4-perspective',
        title: 'Perspective',
        inputs: [
          { label: 'fov (°)', name: 'fov',  value: 60,  min: 10,  max: 170, step: 1    },
          { label: 'aspect',  name: 'asp',  value: 1.78, min: 0.5, max: 3,  step: 0.01 },
          { label: 'near',    name: 'near', value: 0.1, min: 0.01, max: 10, step: 0.01 },
          { label: 'far',     name: 'far',  value: 100, min: 10,  max: 1000, step: 1   },
        ],
        preview:  (v) => `Mat4.perspective(${v.fov}*π/180, ${n2(v.asp)}, ${v.near}, ${v.far})`,
        compute:  (v) => Mat4.perspective(v.fov * Math.PI / 180, v.asp, v.near, v.far),
        visualize(ctx, size, v) {
          const m = Mat4.perspective(v.fov * Math.PI / 180, v.asp, v.near, v.far);
          drawMatrixGrid(ctx, size, m.array, 4, 4);
        },
      },

      {
        id: 'm4-xrot',
        title: 'X Rotation',
        inputs: [
          { label: 'angle (°)', name: 'deg', value: 30, min: -180, max: 180, step: 1 },
        ],
        preview:  (v) => `Mat4.fromXRotation(${v.deg}*Math.PI/180)`,
        compute:  (v) => Mat4.fromXRotation(v.deg * Math.PI / 180),
        visualize(ctx, size, v) {
          drawMatrixGrid(ctx, size, Mat4.fromXRotation(v.deg * Math.PI / 180).array, 4, 4);
        },
      },
    ],
  },

  // ─── Quat ────────────────────────────────────────────────────────────────
  {
    name: 'Quat',
    description: 'Quaternion — encodes 3D rotation as (x, y, z, w). Avoids gimbal lock.',
    placeholder: "Quat.fromAxisAngle(new Vec3(0,1,0), Math.PI/4)",
    examples: [

      {
        id: 'q-axis-angle',
        title: 'From Axis/Angle',
        inputs: [
          { label: 'axis.x',    name: 'ax',  value:  0,  min: -1,   max: 1,   step: 0.01 },
          { label: 'axis.y',    name: 'ay',  value:  1,  min: -1,   max: 1,   step: 0.01 },
          { label: 'axis.z',    name: 'az',  value:  0,  min: -1,   max: 1,   step: 0.01 },
          { label: 'angle (°)', name: 'deg', value: 45, min: -180, max: 180, step: 1    },
        ],
        preview:  (v) => `Quat.fromAxisAngle(new Vec3(${v.ax},${v.ay},${v.az}), ${v.deg}*π/180)`,
        compute:  (v) => Quat.fromAxisAngle(new Vec3(v.ax, v.ay, v.az), v.deg * Math.PI / 180),
        visualize(ctx, size, v) {
          const q = Quat.fromAxisAngle(new Vec3(v.ax, v.ay, v.az), v.deg * Math.PI / 180);
          drawMatrixGrid(ctx, size, [q.x, q.y, q.z, q.w], 1, 4);
        },
      },

      {
        id: 'q-multiply',
        title: 'Multiply',
        inputs: [
          { label: 'a° around Y', name: 'adeg', value:  30, min: -180, max: 180, step: 1 },
          { label: 'b° around X', name: 'bdeg', value:  45, min: -180, max: 180, step: 1 },
        ],
        preview:  (v) => `quatA.multiply(quatB)`,
        compute:  (v) => {
          const a = Quat.fromAxisAngle(new Vec3(0, 1, 0), v.adeg * Math.PI / 180);
          const b = Quat.fromAxisAngle(new Vec3(1, 0, 0), v.bdeg * Math.PI / 180);
          return a.multiply(b);
        },
        visualize(ctx, size, v) {
          const a = Quat.fromAxisAngle(new Vec3(0, 1, 0), v.adeg * Math.PI / 180);
          const b = Quat.fromAxisAngle(new Vec3(1, 0, 0), v.bdeg * Math.PI / 180);
          a.multiply(b);
          drawMatrixGrid(ctx, size, [a.x, a.y, a.z, a.w], 1, 4);
        },
      },

      {
        id: 'q-from-mat3',
        title: 'Rotate vector',
        inputs: [
          { label: 'v.x',      name: 'vx',  value:  1,  min: -3,   max: 3,   step: 0.1 },
          { label: 'v.y',      name: 'vy',  value:  0,  min: -3,   max: 3,   step: 0.1 },
          { label: 'v.z',      name: 'vz',  value:  0,  min: -3,   max: 3,   step: 0.1 },
          { label: 'angle (°)', name: 'deg', value: 90, min: -180, max: 180, step: 1   },
        ],
        preview:  (v) => `// rotate Vec3 by quaternion via Mat3\nMat3.fromQuat(q).transformVec3(v)`,
        compute:  (v) => {
          const q  = Quat.fromAxisAngle(new Vec3(0, 1, 0), v.deg * Math.PI / 180);
          const m3 = Mat3.fromQuat(q.array);
          return new Vec3(v.vx, v.vy, v.vz).transformByMat3New(m3);
        },
        legend: [
          { label: 'original', color: P.green },
          { label: 'rotated',  color: P.amber },
        ],
        visualize(ctx, size, v) {
          const q  = Quat.fromAxisAngle(new Vec3(0, 1, 0), v.deg * Math.PI / 180);
          const m3 = Mat3.fromQuat(q.array);
          const r  = new Vec3(v.vx, v.vy, v.vz).transformByMat3New(m3);
          drawIso(ctx, size, [
            { x: v.vx, y: v.vy, z: v.vz, color: P.green, label: 'v' },
            { x: r.x,  y: r.y,  z: r.z,  color: P.amber, label: "v'" },
          ]);
        },
      },
    ],
  },

];

// ─── State ────────────────────────────────────────────────────────────────────

let activeTab     = 0;
let activeExample = 0;
const inputValues: Record<string, number> = {};

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const tabBtns      = Array.from(document.querySelectorAll<HTMLButtonElement>('.tab-btn'));
const tabDescEl    = document.getElementById('tab-desc')!;
const examplesEl   = document.getElementById('examples')!;
const canvasEl     = document.getElementById('canvas') as HTMLCanvasElement;
const legendEl     = document.getElementById('canvas-legend')!;
const tryitInputEl = document.getElementById('tryit-input') as HTMLTextAreaElement;
const outputValEl  = document.getElementById('output-value')!;

let canvasCtx: CanvasRenderingContext2D;
let canvasSize: number;

// ─── Rendering ───────────────────────────────────────────────────────────────

function getValues(): Record<string, number> {
  return { ...inputValues };
}

function renderLegend() {
  const ex = TABS[activeTab].examples[activeExample];
  legendEl.innerHTML = '';
  if (!ex.legend) return;
  ex.legend.forEach(({ label: lbl, color }) => {
    const item = document.createElement('span');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span>${lbl}`;
    legendEl.appendChild(item);
  });
}

function renderCanvas() {
  const ex = TABS[activeTab].examples[activeExample];
  if (!canvasCtx) return;
  ex.visualize(canvasCtx, canvasSize, getValues());
}

function computeResult(ex: Example, vals: Record<string, number>): string {
  try {
    return formatResult(ex.compute(vals));
  } catch (e) {
    return `Error: ${(e as Error).message}`;
  }
}

function renderExamples() {
  const tab = TABS[activeTab];
  examplesEl.innerHTML = '';

  tab.examples.forEach((ex, idx) => {
    const isActive = idx === activeExample;
    const vals     = getValues();
    const resultStr = computeResult(ex, vals);
    const previewStr = ex.preview(vals);

    const item = document.createElement('div');
    item.className = `example-item${isActive ? ' active' : ''}`;
    item.setAttribute('role', 'listitem');

    item.innerHTML = `
      <div class="example-header">
        <span class="example-num">${String(idx + 1).padStart(2, '0')}</span>
        <div class="example-meta">
          <div class="example-title">${ex.title}</div>
          <div class="example-preview">${previewStr}</div>
        </div>
        <span class="example-chevron">▶</span>
      </div>
      ${isActive ? `
      <div class="example-body">
        <div class="example-result">${resultStr}</div>
        ${ex.inputs.length ? `<div class="inputs-grid" data-example="${idx}"></div>` : ''}
      </div>` : ''}
    `;

    item.querySelector('.example-header')!.addEventListener('click', () => {
      setExample(idx);
    });

    examplesEl.appendChild(item);

    // Build input controls
    if (isActive && ex.inputs.length) {
      const grid = item.querySelector<HTMLElement>('.inputs-grid')!;
      ex.inputs.forEach(inp => {
        if (!(inp.name in inputValues)) inputValues[inp.name] = inp.value;
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `
          <div class="input-label">${inp.label}</div>
          <div class="input-row">
            <input class="input-slider" type="range"
              min="${inp.min}" max="${inp.max}" step="${inp.step}"
              value="${inputValues[inp.name]}">
            <input class="input-number" type="number"
              min="${inp.min}" max="${inp.max}" step="${inp.step}"
              value="${inputValues[inp.name]}">
          </div>
        `;

        const slider = group.querySelector<HTMLInputElement>('.input-slider')!;
        const number = group.querySelector<HTMLInputElement>('.input-number')!;

        const sync = (val: number) => {
          inputValues[inp.name] = val;
          slider.value = String(val);
          number.value = String(val);
          updateAll();
        };

        slider.addEventListener('input', () => sync(parseFloat(slider.value)));
        number.addEventListener('change', () => sync(parseFloat(number.value)));

        grid.appendChild(group);
      });
    }
  });
}

function updateAll() {
  const tab = TABS[activeTab];
  const ex  = tab.examples[activeExample];
  const vals = getValues();

  // Update active example's result & preview
  const activeItem  = examplesEl.querySelector<HTMLElement>('.example-item.active');
  if (activeItem) {
    const resultEl  = activeItem.querySelector('.example-result');
    const previewEl = activeItem.querySelector('.example-preview');
    if (resultEl)  resultEl.textContent = computeResult(ex, vals);
    if (previewEl) previewEl.textContent = ex.preview(vals);
  }

  renderCanvas();
}

function setExample(idx: number) {
  // Reset input values for the new example
  const ex = TABS[activeTab].examples[idx];
  ex.inputs.forEach(inp => { inputValues[inp.name] = inp.value; });
  activeExample = idx;
  renderExamples();
  renderLegend();
  renderCanvas();
}

function setTab(idx: number) {
  activeTab     = idx;
  activeExample = 0;

  tabBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));

  const tab = TABS[idx];
  tabDescEl.textContent = tab.description;
  tryitInputEl.placeholder = tab.placeholder;
  tryitInputEl.value = '';
  outputValEl.textContent = '—';
  outputValEl.classList.remove('err');

  // Reset input state for new tab's first example
  tab.examples[0]?.inputs.forEach(inp => { inputValues[inp.name] = inp.value; });

  renderExamples();
  renderLegend();
  renderCanvas();
}

// ─── Try It Evaluator ────────────────────────────────────────────────────────

function evaluate(code: string) {
  const fn = new Function(
    'Vec2', 'Vec3', 'Vec4', 'Mat2', 'Mat3', 'Mat4', 'Quat', 'Math',
    `"use strict"; return (${code})`
  );
  return fn(Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, Quat, Math);
}

let evalTimer: ReturnType<typeof setTimeout> | null = null;

tryitInputEl.addEventListener('input', () => {
  if (evalTimer) clearTimeout(evalTimer);
  evalTimer = setTimeout(() => {
    const code = tryitInputEl.value.trim();
    if (!code) {
      outputValEl.textContent = '—';
      outputValEl.classList.remove('err');
      return;
    }
    try {
      const result = evaluate(code);
      outputValEl.textContent = formatResult(result);
      outputValEl.classList.remove('err');
    } catch (e) {
      outputValEl.textContent = (e as Error).message;
      outputValEl.classList.add('err');
    }
  }, 120);
});

// ─── Tab buttons ─────────────────────────────────────────────────────────────

tabBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => setTab(idx));
});

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  const result = setupCanvas(canvasEl);
  canvasCtx    = result.ctx;
  canvasSize   = result.size;

  setTab(0);
}

window.addEventListener('resize', () => {
  const result = setupCanvas(canvasEl);
  canvasCtx    = result.ctx;
  canvasSize   = result.size;
  renderCanvas();
});

init();

// Close demos dropdown when clicking outside it
const demosDropdown = document.querySelector<HTMLDetailsElement>('.nav-dropdown');
if (demosDropdown) {
  document.addEventListener('click', e => {
    if (!demosDropdown.contains(e.target as Node)) {
      demosDropdown.removeAttribute('open');
    }
  });
}
