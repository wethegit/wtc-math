/**
 * A 2D vector: a {@link Vec2}, any object with `x` and `y`, or an `[x, y]` array.
 */
export type Vec2Like =
  | {
      /** The x component. */
      x: number;
      /** The y component. */
      y: number;
    }
  | [number, number];
/**
 * A 3D vector: a {@link Vec3}, any object with `x`, `y` and `z`, or an `[x, y, z]` array.
 */
export type Vec3Like =
  | {
      /** The x component. */
      x: number;
      /** The y component. */
      y: number;
      /** The z component. */
      z: number;
    }
  | [number, number, number];
/**
 * A 4D vector: a {@link Vec4}, any object with `x`, `y`, `z` and `w`, or an `[x, y, z, w]` array.
 */
export type Vec4Like =
  | {
      /** The x component. */
      x: number;
      /** The y component. */
      y: number;
      /** The z component. */
      z: number;
      /** The w component. */
      w: number;
    }
  | [number, number, number, number];
/**
 * A quaternion: a {@link Quat} or anything accepted as a {@link Vec4Like}, ordered x, y, z, w.
 */
export type QuatLike = Vec4Like;
/**
 * A 2×2 matrix: a {@link Mat2}, any object with an `array` of elements, or a plain array of 4 numbers.
 */
export type Mat2Like =
  | {
      /** The matrix elements. */
      array: number[];
    }
  | number[];
/**
 * A 3×3 matrix: a {@link Mat3}, any object with an `array` of elements, or a plain array of 9 numbers.
 */
export type Mat3Like =
  | {
      /** The matrix elements. */
      array: number[];
    }
  | number[];
/**
 * A 4×4 matrix: a {@link Mat4}, any object with an `array` of elements, or a plain array of 16 numbers.
 */
export type Mat4Like =
  | {
      /** The matrix elements. */
      array: number[];
    }
  | number[];
