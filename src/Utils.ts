export const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const map = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const smootherstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const degToRad = (deg: number): number => deg * (Math.PI / 180);

export const radToDeg = (rad: number): number => rad * (180 / Math.PI);

export const pingpong = (t: number, length: number): number => {
  const mod = t % (length * 2);
  return mod < length ? mod : length * 2 - mod;
};
