import { Color } from "../src/Color";

const canvas    = document.getElementById("harm-canvas")      as HTMLCanvasElement;
const container = document.getElementById("harm-canvas-area") as HTMLDivElement;

// ── Harmony definitions ───────────────────────────────────────────────────────

const HARMONIES = [
  { key: "triadic",    offsets: [120, 240],          label: "Triadic",    cssVar: "--amber"  },
  { key: "analogous",  offsets: [-30, -15, 15, 30],  label: "Analogous",  cssVar: "--green"  },
  { key: "split-comp", offsets: [150, 210],           label: "Split-comp", cssVar: "--purple" },
  { key: "tetradic",   offsets: [90, 180, 270],       label: "Tetradic",   cssVar: "--red"    },
] as const;

type HarmKey = typeof HARMONIES[number]["key"];

// ── State ─────────────────────────────────────────────────────────────────────

let baseHue    = 200;
let isDragging = false;
const enabled  = new Set<HarmKey>(HARMONIES.map(h => h.key) as HarmKey[]);

interface DotInfo {
  x: number; y: number;
  hue: number;
  color: Color;
  key: HarmKey | null;
  accent: string;
  offset: number;
  label: string;
  r: number;
}

let dots: DotInfo[] = [];
let hoveredIdx  = -1;
let hoveredKey: HarmKey | null = null;

// ── Geometry ──────────────────────────────────────────────────────────────────

function hue2angle(hue: number): number {
  return (hue / 360) * Math.PI * 2 - Math.PI / 2;
}

function angle2hue(a: number): number {
  return (((a + Math.PI / 2) / (Math.PI * 2)) * 360 + 360) % 360;
}

function normHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

// ── Draw ──────────────────────────────────────────────────────────────────────

function draw() {
  canvas.setAttribute("aria-valuenow", String(Math.round(baseHue) % 360));
  canvas.setAttribute("aria-valuetext", `${Math.round(baseHue) % 360}°`);

  const W = container.clientWidth;
  const H = container.clientHeight;
  if (!W || !H) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = `${W}px`;
  canvas.style.height = `${H}px`;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const cs     = getComputedStyle(document.documentElement);
  const bg     = cs.getPropertyValue("--surface").trim();
  const border = cs.getPropertyValue("--border").trim();

  const accentMap: Record<string, string> = {};
  for (const h of HARMONIES) {
    accentMap[h.key] = cs.getPropertyValue(h.cssVar).trim();
  }

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const cx      = W / 2;
  const cy      = H / 2;
  const minDim  = Math.min(W, H);
  const outerR  = minDim * 0.43;
  const innerR  = minDim * 0.30;
  const ringMid = (outerR + innerR) / 2;
  const centerR = innerR * 0.55;

  // ── Hue ring ──
  const SLICES = 720;
  for (let i = 0; i < SLICES; i++) {
    const a1 = (i / SLICES) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / SLICES) * Math.PI * 2 - Math.PI / 2;
    ctx.fillStyle = Color.fromOklch(0.70, 0.13, (i / SLICES) * 360).toCSS();
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, a1, a2);
    ctx.arc(cx, cy, innerR, a2, a1, true);
    ctx.closePath();
    ctx.fill();
  }

  // Inner dark fill
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fill();

  // Centre swatch
  const baseColor = Color.fromOklch(0.70, 0.13, baseHue);
  ctx.fillStyle = baseColor.toCSS();
  ctx.beginPath();
  ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
  ctx.stroke();

  // ── Build dot list ──
  function dotPos(hue: number): [number, number] {
    const a = hue2angle(hue);
    return [cx + Math.cos(a) * ringMid, cy + Math.sin(a) * ringMid];
  }

  const newDots: DotInfo[] = [];

  for (const h of HARMONIES) {
    if (!enabled.has(h.key)) continue;
    for (const offset of h.offsets) {
      const hue = normHue(baseHue + offset);
      const [x, y] = dotPos(hue);
      newDots.push({
        x, y, hue,
        color: Color.fromOklch(0.70, 0.13, hue),
        key: h.key, accent: accentMap[h.key],
        offset, label: h.label, r: 9,
      });
    }
  }

  const [bx, by] = dotPos(baseHue);
  newDots.push({
    x: bx, y: by, hue: baseHue, color: baseColor,
    key: null, accent: "rgba(255,255,255,0.85)",
    offset: 0, label: "Base", r: 13,
  });

  dots = newDots;

  // ── Connection lines ──
  for (const dot of dots) {
    if (!dot.key) continue;
    const lit = dot.key === hoveredKey;
    ctx.strokeStyle = dot.accent + (lit ? "55" : "18");
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(dot.x, dot.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // ── Dots ──
  let tooltipDot: DotInfo | null = null;

  for (let i = 0; i < dots.length; i++) {
    const dot      = dots[i];
    const isHov    = i === hoveredIdx;
    const isSib    = !!(dot.key && dot.key === hoveredKey && !isHov);
    const r        = isHov ? dot.r * 1.5 : isSib ? dot.r * 1.15 : dot.r;

    if (isHov && dot.key) {
      ctx.shadowColor = dot.accent;
      ctx.shadowBlur  = 16;
    }

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
    ctx.fillStyle = dot.color.toCSS();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = dot.key ? dot.accent : "rgba(255,255,255,0.85)";
    ctx.lineWidth   = isHov ? 2 : 1.5;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
    ctx.stroke();

    if (isHov && dot.key) tooltipDot = dot;
  }

  // ── Tooltip ──
  if (tooltipDot) {
    const d     = tooltipDot;
    const sign  = d.offset > 0 ? "+" : "";
    const line1 = d.color.toHex();
    const line2 = `${d.label}  ${sign}${d.offset}°`;

    ctx.font = `500 11px var(--font)`;
    const tw  = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width) + 18;
    const th  = 38;
    const gap = d.r * 1.5 + 10;

    let tx = d.x + gap;
    let ty = d.y - th / 2;
    if (tx + tw > W - 8) tx = d.x - gap - tw;
    ty = Math.max(8, Math.min(ty, H - th - 8));

    // Fresh path, or the fill would also cover the last dot drawn
    ctx.beginPath();
    (ctx as any).roundRect(tx, ty, tw, th, 4);
    ctx.fillStyle = "rgba(0,0,0,0.84)";
    ctx.fill();
    ctx.strokeStyle = d.accent + "40";
    ctx.lineWidth   = 1;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = d.accent;
    ctx.fillText(line1, tx + 9, ty + 14);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(line2, tx + 9, ty + 28);
  }
}

// ── Interaction ───────────────────────────────────────────────────────────────

function angleFromMouse(e: MouseEvent): number {
  const r = canvas.getBoundingClientRect();
  return Math.atan2(
    e.clientY - r.top  - r.height / 2,
    e.clientX - r.left - r.width  / 2,
  );
}

function checkHover(e: MouseEvent) {
  const r  = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  let best = -1, bestDist = Infinity;
  let bestKey: HarmKey | null = null;

  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    if (!d.key) continue;
    const dx = mx - d.x, dy = my - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < d.r * 2.2 && dist < bestDist) {
      best = i; bestDist = dist; bestKey = d.key;
    }
  }

  if (best !== hoveredIdx) {
    hoveredIdx = best;
    hoveredKey = bestKey;
    draw();
  }
}

canvas.addEventListener("mousedown", e => {
  isDragging  = true;
  hoveredIdx  = -1;
  hoveredKey  = null;
  canvas.style.cursor = "grabbing";
  baseHue = angle2hue(angleFromMouse(e));
  draw();
});

window.addEventListener("mousemove", e => {
  if (isDragging) {
    baseHue = angle2hue(angleFromMouse(e));
    draw();
  } else {
    checkHover(e);
  }
});

window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  canvas.style.cursor = "grab";
});

// Touch
function touchAngle(t: Touch): number {
  const r = canvas.getBoundingClientRect();
  return Math.atan2(
    t.clientY - r.top  - r.height / 2,
    t.clientX - r.left - r.width  / 2,
  );
}

canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  isDragging = true;
  baseHue = angle2hue(touchAngle(e.touches[0]));
  draw();
}, { passive: false });

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  baseHue = angle2hue(touchAngle(e.touches[0]));
  draw();
}, { passive: false });

canvas.addEventListener("touchend", () => { isDragging = false; });

// Keyboard — the canvas is a role="slider" for the base hue
const HUE_KEYS: Record<string, (h: number, big: boolean) => number> = {
  ArrowRight: (h, big) => h + (big ? 15 : 1),
  ArrowUp:    (h, big) => h + (big ? 15 : 1),
  ArrowLeft:  (h, big) => h - (big ? 15 : 1),
  ArrowDown:  (h, big) => h - (big ? 15 : 1),
  PageUp:     h => h + 30,
  PageDown:   h => h - 30,
  Home:       () => 0,
  End:        () => 359,
};

canvas.addEventListener("keydown", e => {
  const step = HUE_KEYS[e.key];
  if (!step) return;
  e.preventDefault();
  baseHue = normHue(Math.round(step(baseHue, e.shiftKey)));
  draw();
});

// ── Toggle chips ──────────────────────────────────────────────────────────────

document.querySelectorAll<HTMLButtonElement>(".harm-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key as HarmKey;
    if (enabled.has(key)) {
      enabled.delete(key);
      btn.classList.remove("active");
    } else {
      enabled.add(key);
      btn.classList.add("active");
    }
    if (hoveredKey === key) { hoveredIdx = -1; hoveredKey = null; }
    draw();
  });
});

window.addEventListener("resize", draw);
canvas.style.cursor = "grab";
draw();
