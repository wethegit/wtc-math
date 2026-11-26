import { radianToDegrees, degreesToRadian } from "./common.js";
import type { Vec2Like, Mat2Like, Mat3Like } from "./types.js";

/**
 * A 2D vector with x and y components.
 *
 * Most operations come in two forms: the plain method changes this vector in
 * place and returns it for chaining, and the `…New` variant returns a new
 * vector and leaves this one unchanged. Length, angle and the swizzles
 * (`xy`, `yx`, `xx`, `yy`) are exposed as getters and setters.
 *
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec2 {
  /**
   * Create a vector. Missing or `NaN` components default to 0.
   *
   * @param args The x and y components
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Set the components in place. Missing or `NaN` components are set to 0.
   *
   * @param args The x and y components
   * @returns This vector, for chaining
   */
  reset(...args: number[]): Vec2 {
    let [x, y] = args;
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Copy the components of another vector into this one.
   *
   * @param v The vector to copy from
   * @returns This vector, for chaining
   */
  resetToVector(v: Vec2): Vec2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /**
   * Create a copy of this vector.
   *
   * @returns A new vector with the same components
   */
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Add another vector to this one, in place.
   *
   * @param vector The vector to add
   * @returns This vector, for chaining
   */
  add(vector: Vec2): Vec2 {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  /**
   * Like {@link Vec2.add}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to add
   * @returns A new vector
   */
  addNew(vector: Vec2): Vec2 {
    return this.clone().add(vector);
  }

  /**
   * Add a scalar to both components, in place.
   *
   * @param scalar The value to add to x and y
   * @returns This vector, for chaining
   */
  addScalar(scalar: number): Vec2 {
    return this.add(new Vec2(scalar, scalar));
  }
  /**
   * Like {@link Vec2.addScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to add to x and y
   * @returns A new vector
   */
  addScalarNew(scalar: number): Vec2 {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtract another vector from this one, in place.
   *
   * @param vector The vector to subtract
   * @returns This vector, for chaining
   */
  subtract(vector: Vec2): Vec2 {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  /**
   * Like {@link Vec2.subtract}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to subtract
   * @returns A new vector
   */
  subtractNew(vector: Vec2): Vec2 {
    return this.clone().subtract(vector);
  }

  /**
   * Subtract a scalar from both components, in place.
   *
   * @param scalar The value to subtract from x and y
   * @returns This vector, for chaining
   */
  subtractScalar(scalar: number): Vec2 {
    return this.subtract(new Vec2(scalar, scalar));
  }
  /**
   * Like {@link Vec2.subtractScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to subtract from x and y
   * @returns A new vector
   */
  subtractScalarNew(scalar: number): Vec2 {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divide this vector component-wise by another, in place. Dividing a
   * component by 0 sets that component to 0.
   *
   * @param vector The vector to divide by
   * @returns This vector, for chaining
   */
  divide(vector: Vec2): Vec2 {
    if (vector.x !== 0) {
      this.x /= vector.x;
    } else {
      this.x = 0;
    }
    if (vector.y !== 0) {
      this.y /= vector.y;
    } else {
      this.y = 0;
    }
    return this;
  }
  /**
   * Like {@link Vec2.divide}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to divide by
   * @returns A new vector
   */
  divideNew(vector: Vec2): Vec2 {
    return this.clone().divide(vector);
  }

  /**
   * Divide both components by a scalar, in place. Dividing by 0 sets both
   * components to 0.
   *
   * @param scalar The value to divide x and y by
   * @returns This vector, for chaining
   */
  divideScalar(scalar: number): Vec2 {
    var v = new Vec2(scalar, scalar);
    return this.divide(v);
  }
  /**
   * Like {@link Vec2.divideScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to divide x and y by
   * @returns A new vector
   */
  divideScalarNew(scalar: number): Vec2 {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiply this vector component-wise by another, in place.
   *
   * @param vector The vector to multiply by
   * @returns This vector, for chaining
   */
  multiply(vector: Vec2): Vec2 {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }
  /**
   * Like {@link Vec2.multiply}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to multiply by
   * @returns A new vector
   */
  multiplyNew(vector: Vec2): Vec2 {
    return this.clone().multiply(vector);
  }

  /**
   * Multiply both components by a scalar, in place.
   *
   * @param scalar The value to multiply x and y by
   * @returns This vector, for chaining
   */
  multiplyScalar(scalar: number): Vec2 {
    var v = new Vec2(scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Like {@link Vec2.multiplyScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to multiply x and y by
   * @returns A new vector
   */
  multiplyScalarNew(scalar: number): Vec2 {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of {@link Vec2.multiplyScalar}. Scales the vector in place.
   *
   * @param scalar The value to multiply x and y by
   * @returns This vector, for chaining
   */
  scale(scalar: number): Vec2 {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of {@link Vec2.multiplyScalarNew}. Returns a new scaled vector.
   *
   * @param scalar The value to multiply x and y by
   * @returns A new vector
   */
  scaleNew(scalar: number): Vec2 {
    return this.multiplyScalarNew(scalar);
  }

  /**
   * Rotate the vector anticlockwise about the origin by an angle in radians,
   * in place.
   *
   * @param radian The angle to rotate by, in radians
   * @returns This vector, for chaining
   */
  rotate(radian: number): Vec2 {
    var x = this.x * Math.cos(radian) - this.y * Math.sin(radian);
    var y = this.x * Math.sin(radian) + this.y * Math.cos(radian);

    this.x = x;
    this.y = y;

    return this;
  }
  /**
   * Like {@link Vec2.rotate}, but returns a new vector and leaves this one unchanged.
   *
   * @param radian The angle to rotate by, in radians
   * @returns A new vector
   */
  rotateNew(radian: number): Vec2 {
    return this.clone().rotate(radian);
  }

  /**
   * Rotate the vector by an angle in degrees, in place.
   *
   * @param degrees The angle to rotate by, in degrees
   * @returns This vector, for chaining
   */
  rotateDeg(degrees: number): Vec2 {
    return this.rotate(degreesToRadian(degrees));
  }
  /**
   * Like {@link Vec2.rotateDeg}, but returns a new vector and leaves this one unchanged.
   *
   * @param degrees The angle to rotate by, in degrees
   * @returns A new vector
   */
  rotateDegNew(degrees: number): Vec2 {
    return this.rotateNew(degreesToRadian(degrees));
  }

  /**
   * Alias of {@link Vec2.rotate}. Rotates in place by an angle in radians.
   *
   * @param radian The angle to rotate by, in radians
   * @returns This vector, for chaining
   */
  rotateBy(radian: number): Vec2 {
    return this.rotate(radian);
  }
  /**
   * Alias of {@link Vec2.rotateNew}. Returns a new vector rotated by an angle in radians.
   *
   * @param radian The angle to rotate by, in radians
   * @returns A new vector
   */
  rotateByNew(radian: number): Vec2 {
    return this.rotateNew(radian);
  }

  /**
   * Alias of {@link Vec2.rotateDeg}. Rotates in place by an angle in degrees.
   *
   * @param degrees The angle to rotate by, in degrees
   * @returns This vector, for chaining
   */
  rotateDegBy(degrees: number): Vec2 {
    return this.rotateDeg(degrees);
  }
  /**
   * Alias of {@link Vec2.rotateDegNew}. Returns a new vector rotated by an angle in degrees.
   *
   * @param degrees The angle to rotate by, in degrees
   * @returns A new vector
   */
  rotateDegByNew(degrees: number): Vec2 {
    return this.rotateDegNew(degrees);
  }

  /**
   * Rotate the vector so it points at an absolute angle in radians, keeping
   * its length, in place.
   *
   * @param radian The target angle, in radians, measured from the positive x axis
   * @returns This vector, for chaining
   */
  rotateTo(radian: number): Vec2 {
    return this.rotate(radian - this.angle);
  }
  /**
   * Like {@link Vec2.rotateTo}, but returns a new vector and leaves this one unchanged.
   *
   * @param radian The target angle, in radians
   * @returns A new vector
   */
  rotateToNew(radian: number): Vec2 {
    return this.clone().rotateTo(radian);
  }

  /**
   * Rotate the vector so it points at an absolute angle in degrees, keeping
   * its length, in place.
   *
   * @param degrees The target angle, in degrees, measured from the positive x axis
   * @returns This vector, for chaining
   */
  rotateToDeg(degrees: number): Vec2 {
    return this.rotateTo(degreesToRadian(degrees));
  }
  /**
   * Like {@link Vec2.rotateToDeg}, but returns a new vector and leaves this one unchanged.
   *
   * @param degrees The target angle, in degrees
   * @returns A new vector
   */
  rotateToDegNew(degrees: number): Vec2 {
    return this.rotateToNew(degreesToRadian(degrees));
  }

  /**
   * Negate both components, in place.
   *
   * @returns This vector, for chaining
   */
  negate(): Vec2 {
    return this.multiplyScalar(-1);
  }

  /**
   * Like {@link Vec2.negate}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  negateNew(): Vec2 {
    return this.multiplyScalarNew(-1);
  }

  /**
   * Replace each component with its reciprocal (`1 / x`, `1 / y`), in place.
   * A zero component stays 0, as in {@link Vec2.divide}.
   *
   * @returns This vector, for chaining
   */
  inverse(): Vec2 {
    this.x = this.x === 0 ? 0 : 1 / this.x;
    this.y = this.y === 0 ? 0 : 1 / this.y;
    return this;
  }

  /**
   * Like {@link Vec2.inverse}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  inverseNew(): Vec2 {
    return this.clone().inverse();
  }

  /**
   * Scale the vector to a length of 1, in place. A zero-length vector stays
   * at zero.
   *
   * @returns This vector, for chaining
   */
  normalise(): Vec2 {
    return this.divideScalar(this.length);
  }
  /**
   * Like {@link Vec2.normalise}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  normaliseNew(): Vec2 {
    return this.divideScalarNew(this.length);
  }

  /**
   * The distance between this vector and another, treating both as points.
   *
   * @param vector The other point
   * @returns The distance between the two points
   */
  distance(vector: Vec2): number {
    return this.subtractNew(vector).length;
  }

  /**
   * The signed difference along the x axis, `this.x - vector.x`.
   *
   * @param vector The other point
   * @returns The x distance, which can be negative
   */
  distanceX(vector: Vec2): number {
    return this.x - vector.x;
  }

  /**
   * The signed difference along the y axis, `this.y - vector.y`.
   *
   * @param vector The other point
   * @returns The y distance, which can be negative
   */
  distanceY(vector: Vec2): number {
    return this.y - vector.y;
  }

  /**
   * The dot product of this vector and another.
   *
   * @example
   * ```ts
   * new Vec2(2, -3).dot(new Vec2(-4, 2)); // -14
   * ```
   *
   * @param vector The other vector
   * @returns The dot product
   */
  dot(vector: Vec2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * The determinant of the 2×2 matrix formed by this vector and another,
   * `this.x * vector.y - this.y * vector.x`. Same result as {@link Vec2.cross}.
   *
   * @param vector The other vector
   * @returns The determinant
   */
  det(vector: Vec2): number {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
   * The slope of the line from this point to another, `Δy / Δx`. Returns
   * `±Infinity` for a vertical line and `NaN` when the points are equal.
   *
   * @param vector The other point
   * @returns The slope of the line between the two points
   */
  slopeBetween(vector: Vec2): number {
    return (vector.y - this.y) / (vector.x - this.x);
  }

  /**
   * The 2D cross product (the z component of the 3D cross product),
   * `this.x * vector.y - this.y * vector.x`. Positive when `vector` is
   * anticlockwise from this one.
   *
   * @example
   * ```ts
   * new Vec2(2, -3).cross(new Vec2(-4, 2)); // -8
   * new Vec2(-4, 2).cross(new Vec2(2, -3)); // 8
   * ```
   *
   * @param vector The other vector
   * @returns The cross product
   */
  cross(vector: Vec2): number {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
   * Round both components up to the nearest integer, in place.
   *
   * @returns This vector, for chaining
   */
  ceil(): Vec2 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  /**
   * Like {@link Vec2.ceil}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  ceilNew(): Vec2 {
    return this.clone().ceil();
  }

  /**
   * Round both components down to the nearest integer, in place.
   *
   * @returns This vector, for chaining
   */
  floor(): Vec2 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /**
   * Like {@link Vec2.floor}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  floorNew(): Vec2 {
    return this.clone().floor();
  }

  /**
   * Round both components to the nearest integer, in place.
   *
   * @returns This vector, for chaining
   */
  round(): Vec2 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  /**
   * Like {@link Vec2.round}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  roundNew(): Vec2 {
    return this.clone().round();
  }

  /**
   * Set each component to its remainder after division by the matching
   * component of another vector, in place. Uses JavaScript's `%`, so the
   * result takes the sign of this vector's component (unlike GLSL `mod`),
   * and a zero divisor gives `NaN`.
   *
   * @param vector The divisor
   * @returns This vector, for chaining
   */
  mod(vector: Vec2): Vec2 {
    this.x = this.x % vector.x;
    this.y = this.y % vector.y;
    return this;
  }

  /**
   * Like {@link Vec2.mod}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The divisor
   * @returns A new vector
   */
  modNew(vector: Vec2): Vec2 {
    return this.clone().mod(vector);
  }

  /**
   * Replace each component with its fractional part, `x - floor(x)`, in
   * place. The result is always in the range [0, 1), as in GLSL `fract`.
   *
   * @returns This vector, for chaining
   */
  fract(): Vec2 {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    return this;
  }

  /**
   * Like {@link Vec2.fract}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector
   */
  fractNew(): Vec2 {
    return this.clone().fract();
  }

  /**
   * Multiply this vector by a 2×2 matrix (`m * v`), in place. The matrix is
   * column-major, as WebGL expects.
   *
   * @param m A Mat2 or a 4-element column-major array
   * @returns This vector, for chaining
   */
  transformByMat2(m: Mat2Like): Vec2 {
    const ma = Array.isArray(m) ? m : m.array;
    const c = this.clone();
    this.x = ma[0] * c.x + ma[2] * c.y;
    this.y = ma[1] * c.x + ma[3] * c.y;
    return this;
  }

  /**
   * Like {@link Vec2.transformByMat2}, but returns a new vector and leaves this one unchanged.
   *
   * @param m A Mat2 or a 4-element column-major array
   * @returns A new vector
   */
  transformByMat2New(m: Mat2Like): Vec2 {
    return this.clone().transformByMat2(m);
  }

  /**
   * Transform this vector as a point by a 3×3 matrix, in place. The vector
   * is treated as `(x, y, 1)`, so the translation in the third column is
   * applied; the third row is ignored (no perspective divide). The matrix is
   * column-major, as WebGL expects.
   *
   * @param m A Mat3 or a 9-element column-major array
   * @returns This vector, for chaining
   */
  transformByMat3(m: Mat3Like): Vec2 {
    const ma = Array.isArray(m) ? m : m.array;
    const c = this.clone();
    this.x = ma[0] * c.x + ma[3] * c.y + ma[6];
    this.y = ma[1] * c.x + ma[4] * c.y + ma[7];
    return this;
  }

  /**
   * Like {@link Vec2.transformByMat3}, but returns a new vector and leaves this one unchanged.
   *
   * @param m A Mat3 or a 9-element column-major array
   * @returns A new vector
   */
  transformByMat3New(m: Mat3Like): Vec2 {
    return this.clone().transformByMat3(m);
  }

  /**
   * Getters and setters
   */

  #x: number = 0;
  /**
   * Set the x component. Throws a `TypeError` if the value is not a number.
   * `NaN` is stored as 0.
   */
  set x(x: number) {
    if (typeof x == "number") {
      this.#x = x || 0;
    } else {
      throw new TypeError("X should be a number");
    }
  }
  /**
   * The x component.
   *
   * @default 0
   */
  get x(): number {
    return this.#x || 0;
  }

  #y: number = 0;
  /**
   * Set the y component. Throws a `TypeError` if the value is not a number.
   * `NaN` is stored as 0.
   */
  set y(y: number) {
    if (typeof y == "number") {
      this.#y = y || 0;
    } else {
      throw new TypeError("Y should be a number");
    }
  }
  /**
   * The y component.
   *
   * @default 0
   */
  get y(): number {
    return this.#y || 0;
  }

  /**
   * Set the squared length of the vector, scaling it while keeping its
   * direction. Has no effect on a zero-length vector. Throws a `TypeError` if
   * the value is not a number.
   */
  set lengthSquared(lengthSquared: number) {
    if (typeof lengthSquared == "number") {
      const current = this.lengthSquared;
      if (current > 0) this.multiplyScalar(Math.sqrt(lengthSquared / current));
    } else {
      throw new TypeError("length should be a number");
    }
  }
  /**
   * The squared length of the vector. Cheaper than {@link Vec2.length} when
   * you only need to compare lengths.
   */
  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Set the length of the vector, scaling it while keeping its direction.
   * Has no effect on a zero-length vector. Throws a `TypeError` if the value
   * is not a number.
   */
  set length(length: number) {
    if (typeof length == "number") {
      const current = this.length;
      if (current > 0) this.multiplyScalar(length / current);
    } else {
      throw new TypeError("length should be a number");
    }
  }
  /** The length of the vector. */
  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  /**
   * Rotate the vector to point at this angle, in radians, keeping its length.
   * Throws a `TypeError` if the value is not a number.
   */
  set angle(radian: number) {
    if (typeof radian == "number") {
      this.rotateTo(radian);
    } else {
      throw new TypeError("angle should be a number");
    }
  }
  /**
   * The angle of the vector from the positive x axis, in radians, in the
   * range (-π, π].
   */
  get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Rotate the vector to point at this angle, in degrees, keeping its length.
   * Throws a `TypeError` if the value is not a number.
   */
  set angleInDegrees(degrees: number) {
    if (typeof degrees == "number") {
      this.rotateToDeg(degrees);
    } else {
      throw new TypeError("angle should be a number");
    }
  }
  /**
   * The angle of the vector from the positive x axis, in degrees, in the
   * range (-180, 180].
   */
  get angleInDegrees(): number {
    return radianToDegrees(Math.atan2(this.y, this.x));
  }

  /** Set the width. Alias of setting {@link Vec2.x}. */
  set width(w: number) {
    this.x = w;
  }
  /** The width, when the vector is used as a size. Alias of {@link Vec2.x}. */
  get width(): number {
    return this.x;
  }

  /** Set the height. Alias of setting {@link Vec2.y}. */
  set height(h: number) {
    this.y = h;
  }
  /** The height, when the vector is used as a size. Alias of {@link Vec2.y}. */
  get height(): number {
    return this.y;
  }

  /** The area, when the vector is used as a size: `x * y`. */
  get area(): number {
    return this.x * this.y;
  }

  /**
   * Rotate the vector to match this slope, keeping its length and which side
   * of the y axis it points to: a vector pointing left stays pointing left.
   * `NaN` is ignored.
   */
  set slope(value: number) {
    if (!isNaN(value)) {
      const angle = Math.atan(value);
      this.angle = this.x < 0 ? angle + Math.PI : angle;
    }
  }
  /** The slope of the vector, `y / x`. Returns `±Infinity` or `NaN` when x is 0. */
  get slope(): number {
    return this.y / this.x;
  }

  /** The components as a new `[x, y]` array. */
  get array(): number[] {
    return [this.x, this.y];
  }

  /** The x and y components as a new Vec2. */
  get xy(): Vec2 | number[] {
    return new Vec2(this.x, this.y);
  }
  /**
   * Set x and y from a Vec2 or `[x, y]` array. Throws an `Error` for any
   * other input.
   */
  set xy(v: Vec2 | number[]) {
    if (v instanceof Vec2) {
      this.resetToVector(v);
    } else if (v instanceof Array && v.length >= 2) {
      this.reset(v[0], v[1]);
    } else {
      throw new Error("input should be of type Vector");
    }
  }

  /** The y and x components as a new Vec2. */
  get yx(): Vec2 {
    return new Vec2(this.y, this.x);
  }
  /** Set y and x from a Vec2-like value or `[y, x]` array. */
  set yx(v: Vec2Like) {
    this.xy = Vec2.interpolate(v).yx;
  }

  /** The x component repeated, as a new Vec2. */
  get xx(): Vec2 {
    return new Vec2(this.x, this.x);
  }
  /**
   * Set x from the first component of a Vec2-like value or array. y is left
   * unchanged.
   */
  set xx(v: Vec2Like) {
    this.x = Vec2.interpolate(v).x;
  }

  /** The y component repeated, as a new Vec2. */
  get yy(): Vec2 {
    return new Vec2(this.y, this.y);
  }
  /**
   * Set y from the first component of a Vec2-like value or array. x is left
   * unchanged.
   */
  set yy(v: Vec2Like) {
    this.y = Vec2.interpolate(v).x;
  }

  /**
   * Static methods
   */
  /**
   * Create a new Vec2 from a loosely typed value:
   *
   * - a number, used for both components (`NaN` throws)
   * - a comma-separated string such as `"1,2"` (throws if it can't be parsed)
   * - an array, using its first two elements
   * - any object with `x` and `y` properties
   *
   * @param v The value to convert
   * @returns A new vector
   */
  static interpolate(v: Vec2Like | number | string): Vec2 {
    if (typeof v === "number") {                       // Single number
      if (isNaN(v)) throw new Error("The passed interpolant could not be parsed into a vec2");
      return new Vec2(v, v);
    } else if (typeof v === "string") {               // comma delimited string of numbers
      const nv = v.split(",");
      const x: number = Number(nv[0]);
      const y: number = Number(nv[1]);
      if (nv.length >= 2 && !isNaN(x) && !isNaN(y)) {
        return new Vec2(x, y);
      } else {
        throw new Error("The passed interpolant could not be parsed into a vec2");
      }
    } else if (Array.isArray(v) && v.length >= 2) {  // 2-dimensional array
      return new Vec2(v[0], v[1]);
    } else {                                          // Vec2 or Vec2-like object
      const obj = v as { x: number; y: number };
      return new Vec2(obj.x, obj.y);
    }
  }

  /**
   * Linearly interpolate between two vectors. `d` is not clamped, so values
   * outside 0–1 extrapolate.
   *
   * @param v1 The start vector, returned when `d` is 0
   * @param v2 The end vector, returned when `d` is 1
   * @param d The interpolation amount
   * @returns A new vector
   */
  static lerp(v1: Vec2, v2: Vec2, d: number): Vec2 {
    return new Vec2(v1.x + d * (v2.x - v1.x), v1.y + d * (v2.y - v1.y));
  }

  /**
   * The unsigned angle between two vectors, in radians, in the range [0, π].
   * Neither input is changed. If either vector has zero length the result is
   * π/2.
   *
   * @param a The first vector
   * @param b The second vector
   * @returns The angle between them, in radians
   */
  static getAngle(a: Vec2, b: Vec2): number {
    a = a.clone();
    b = b.clone();

    a.normalise();
    b.normalise();

    const cosine = a.dot(b);

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }

  /** Iterate over the components, so the vector can be spread or destructured: `const [x, y] = v`. */
  [Symbol.iterator](): Iterator<number> {
    return this.array[Symbol.iterator]();
  }
}

export { Vec2 };
