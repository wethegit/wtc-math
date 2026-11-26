/**
 * Clamps a value to a range.
 *
 * @param v The value to clamp.
 * @param min The lower bound.
 * @param max The upper bound.
 * @returns `v` limited to `[min, max]`.
 */
export const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

/**
 * Linearly interpolates between two numbers. `t` is not clamped, so values
 * outside 0–1 extrapolate.
 *
 * @param a The value at `t = 0`.
 * @param b The value at `t = 1`.
 * @param t The interpolation factor.
 * @returns `a + (b - a) * t`.
 */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/**
 * Re-maps a value from one range to another. The result is not clamped, so
 * values outside the input range map outside the output range. If the input
 * range is empty (`inMin === inMax`), returns `outMin`.
 *
 * @param v The value to re-map.
 * @param inMin The start of the input range.
 * @param inMax The end of the input range.
 * @param outMin The start of the output range.
 * @param outMax The end of the output range.
 * @returns `v` moved proportionally from `[inMin, inMax]` to `[outMin, outMax]`.
 *
 * @example
 * ```ts
 * map(5, 0, 10, 100, 200) // 150
 * map(0.25, 0, 1, -1, 1)  // -0.5
 * ```
 */
export const map = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number =>
  inMin === inMax ? outMin : outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

/**
 * Hermite interpolation between two edges, as GLSL's `smoothstep`. Returns 0
 * at or below `edge0`, 1 at or above `edge1`, and an S-curve
 * (`3t² − 2t³`) in between. When the edges are equal it's a step: 0 below
 * the edge, 1 at or above it.
 *
 * @param edge0 The input value that maps to 0.
 * @param edge1 The input value that maps to 1.
 * @param x The input value.
 * @returns A value in 0–1.
 *
 * @example
 * ```ts
 * smoothstep(0, 10, 5)  // 0.5
 * smoothstep(0, 10, 2)  // 0.104
 * smoothstep(0, 10, 12) // 1
 * ```
 */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Ken Perlin's smoother variant of {@link smoothstep}, using
 * `6t⁵ − 15t⁴ + 10t³` so the first and second derivatives are zero at both
 * edges. When the edges are equal it's a step: 0 below the edge, 1 at or
 * above it.
 *
 * @param edge0 The input value that maps to 0.
 * @param edge1 The input value that maps to 1.
 * @param x The input value.
 * @returns A value in 0–1.
 *
 * @example
 * ```ts
 * smootherstep(0, 10, 5) // 0.5
 * smootherstep(0, 10, 2) // 0.058
 * ```
 */
export const smootherstep = (edge0: number, edge1: number, x: number): number => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * Converts degrees to radians.
 *
 * @param deg The angle in degrees.
 * @returns The angle in radians.
 */
export const degToRad = (deg: number): number => deg * (Math.PI / 180);

/**
 * Converts radians to degrees.
 *
 * @param rad The angle in radians.
 * @returns The angle in degrees.
 */
export const radToDeg = (rad: number): number => rad * (180 / Math.PI);

/**
 * Bounces a value back and forth between 0 and `length`: it rises from 0 to
 * `length` as `t` goes from 0 to `length`, then falls back to 0 by
 * `2 * length`, and repeats. A negative `t` mirrors a positive one, so the
 * result is always in `[0, length]`.
 *
 * @param t The input value, such as elapsed time.
 * @param length The peak value.
 * @returns A value in `[0, length]`.
 *
 * @example
 * ```ts
 * pingpong(0.5, 1) // 0.5
 * pingpong(1.5, 1) // 0.5
 * pingpong(2.25, 1) // 0.25
 * ```
 */
export const pingpong = (t: number, length: number): number => {
  const period = length * 2;
  const mod = ((t % period) + period) % period;
  return mod < length ? mod : length * 2 - mod;
};
