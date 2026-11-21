import { Vec2 } from "./Vec2.js";
import type { Vec2Like, Vec3Like, QuatLike, Mat3Like, Mat4Like } from "./types.js";

/**
 * A 3D vector with x, y and z components.
 *
 * Most operations come in two forms: one that changes the vector in place and
 * returns it for chaining (`add`), and a `…New` variant that returns a new
 * vector and leaves this one unchanged (`addNew`). Derived values such as
 * length and the swizzles (`xy`, `yzx`, …) are exposed as getters and setters.
 *
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec3 {
  /**
   * Create a new vector. Missing or `NaN` components default to 0.
   *
   * @param args The x, y and z components.
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Set the components in place. Missing or `NaN` components are set to 0.
   *
   * @param args The x, y and z components.
   * @returns This vector, for chaining.
   */
  reset(...args: number[]): Vec3 {
    let [x, y, z] = args;
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(z)) z = 0;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Copy the components of another vector into this one, in place. Does
   * nothing if `v` is not a `Vec3`.
   *
   * @param v The vector to copy from.
   * @returns This vector, for chaining.
   */
  resetToVector(v: Vec3): Vec3 {
    if (v instanceof Vec3) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    }
    return this;
  }

  /**
   * Create a copy of this vector.
   *
   * @returns A new vector with the same components.
   */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Add another vector to this one, component by component, in place.
   *
   * @param vector The vector to add.
   * @returns This vector, for chaining.
   */
  add(vector: Vec3): Vec3 {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }
  /**
   * Like {@link Vec3.add}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to add.
   * @returns A new vector.
   */
  addNew(vector: Vec3): Vec3 {
    return this.clone().add(vector);
  }

  /**
   * Add a scalar to each component, in place.
   *
   * @param scalar The value to add to x, y and z.
   * @returns This vector, for chaining.
   */
  addScalar(scalar: number): Vec3 {
    return this.add(new Vec3(scalar, scalar, scalar));
  }
  /**
   * Like {@link Vec3.addScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to add to x, y and z.
   * @returns A new vector.
   */
  addScalarNew(scalar: number): Vec3 {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtract another vector from this one, component by component, in place.
   *
   * @param vector The vector to subtract.
   * @returns This vector, for chaining.
   */
  subtract(vector: Vec3): Vec3 {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }
  /**
   * Like {@link Vec3.subtract}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to subtract.
   * @returns A new vector.
   */
  subtractNew(vector: Vec3): Vec3 {
    return this.clone().subtract(vector);
  }

  /**
   * Subtract a scalar from each component, in place.
   *
   * @param scalar The value to subtract from x, y and z.
   * @returns This vector, for chaining.
   */
  subtractScalar(scalar: number): Vec3 {
    return this.subtract(new Vec3(scalar, scalar, scalar));
  }
  /**
   * Like {@link Vec3.subtractScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to subtract from x, y and z.
   * @returns A new vector.
   */
  subtractScalarNew(scalar: number): Vec3 {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divide this vector by another, component by component, in place. Any
   * component divided by zero is set to 0 rather than `Infinity`.
   *
   * @param vector The vector to divide by.
   * @returns This vector, for chaining.
   */
  divide(vector: Vec3): Vec3 {
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
    if (vector.z !== 0) {
      this.z /= vector.z;
    } else {
      this.z = 0;
    }
    return this;
  }
  /**
   * Like {@link Vec3.divide}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to divide by.
   * @returns A new vector.
   */
  divideNew(vector: Vec3): Vec3 {
    return this.clone().divide(vector);
  }

  /**
   * Divide each component by a scalar, in place. Dividing by zero sets every
   * component to 0.
   *
   * @param scalar The value to divide x, y and z by.
   * @returns This vector, for chaining.
   */
  divideScalar(scalar: number): Vec3 {
    var v = new Vec3(scalar, scalar, scalar);
    return this.divide(v);
  }
  /**
   * Like {@link Vec3.divideScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to divide x, y and z by.
   * @returns A new vector.
   */
  divideScalarNew(scalar: number): Vec3 {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiply this vector by another, component by component, in place.
   *
   * @param vector The vector to multiply by.
   * @returns This vector, for chaining.
   */
  multiply(vector: Vec3): Vec3 {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
  }
  /**
   * Like {@link Vec3.multiply}, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to multiply by.
   * @returns A new vector.
   */
  multiplyNew(vector: Vec3): Vec3 {
    return this.clone().multiply(vector);
  }

  /**
   * Multiply each component by a scalar, in place.
   *
   * @param scalar The value to multiply x, y and z by.
   * @returns This vector, for chaining.
   */
  multiplyScalar(scalar: number): Vec3 {
    var v = new Vec3(scalar, scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Like {@link Vec3.multiplyScalar}, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to multiply x, y and z by.
   * @returns A new vector.
   */
  multiplyScalarNew(scalar: number): Vec3 {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of {@link Vec3.multiplyScalar}. Scales the vector in place.
   *
   * @param scalar The value to multiply x, y and z by.
   * @returns This vector, for chaining.
   */
  scale(scalar: number): Vec3 {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of {@link Vec3.multiplyScalarNew}. Returns a new scaled vector and
   * leaves this one unchanged.
   *
   * @param scalar The value to multiply x, y and z by.
   * @returns A new vector.
   */
  scaleNew(scalar: number): Vec3 {
    return this.multiplyScalarNew(scalar);
  }

  /**
   * Rotate the vector around an axis parallel to x that passes through
   * `origin`, in place. Only y and z change. A positive angle turns y towards
   * z (counter-clockwise when looking down the x axis towards the origin).
   *
   * @param origin The point to rotate around.
   * @param radian The angle, in radians.
   * @returns This vector, for chaining.
   */
  rotateX(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const ty = translated.y;

    this.y = ty * c - translated.z * s + origin.y;
    this.z = ty * s + translated.z * c + origin.z;

    return this;
  }

  /**
   * Like {@link Vec3.rotateX}, but returns a new vector and leaves this one unchanged.
   *
   * @param origin The point to rotate around.
   * @param radian The angle, in radians.
   * @returns A new vector.
   */
  rotateXNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateX(origin, radian);
  }

  /**
   * Rotate the vector around an axis parallel to y that passes through
   * `origin`, in place. Only x and z change. A positive angle turns z towards
   * x (counter-clockwise when looking down the y axis towards the origin).
   *
   * @param origin The point to rotate around.
   * @param radian The angle, in radians.
   * @returns This vector, for chaining.
   */
  rotateY(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const tx = translated.x;

    this.x = tx * c + translated.z * s + origin.x;
    this.z = translated.z * c - tx * s + origin.z;

    return this;
  }

  /**
   * Like {@link Vec3.rotateY}, but returns a new vector and leaves this one unchanged.
   *
   * @param origin The point to rotate around.
   * @param radian The angle, in radians.
   * @returns A new vector.
   */
  rotateYNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateY(origin, radian);
  }

  /**
   * Rotate the vector around an axis parallel to z that passes through
   * `origin`, in place. Only x and y change. A positive angle turns x towards
   * y (counter-clockwise when looking down the z axis towards the origin).
   *
   * @param origin The point to rotate around.
   * @param radian The angle, in radians.
   * @returns This vector, for chaining.
   */
  rotateZ(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const tx = translated.x;

    this.x = tx * c - translated.y * s + origin.x;
    this.y = tx * s + translated.y * c + origin.y;

    return this;
  }

  /**
   * Like {@link Vec3.rotateZ}, but returns a new vector and leaves this one unchanged.
   *
   * @param origin The point to rotate around.
   * @param radian The angle, in radians.
   * @returns A new vector.
   */
  rotateZNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateZ(origin, radian);
  }

  /**
   * Transform the vector as a point (w = 1) by a 4×4 column-major matrix, in
   * place, then divide by the resulting w. If w comes out as 0, it is treated
   * as 1 so no divide by zero happens.
   *
   * @param m The matrix, as a Mat4 or a 16-element column-major array.
   * @returns This vector, for chaining.
   */
  transformByMat4(m: Mat4Like): Vec3 {
    const ma = Array.isArray(m) ? m : m.array;
    const o = this.clone();
    const w = ma[3] * o.x + ma[7] * o.y + ma[11] * o.z + ma[15] || 1;
    this.x = (ma[0] * o.x + ma[4] * o.y + ma[8] * o.z + ma[12]) / w;
    this.y = (ma[1] * o.x + ma[5] * o.y + ma[9] * o.z + ma[13]) / w;
    this.z = (ma[2] * o.x + ma[6] * o.y + ma[10] * o.z + ma[14]) / w;
    return this;
  }

  /**
   * Like {@link Vec3.transformByMat4}, but returns a new vector and leaves this one unchanged.
   *
   * @param m The matrix, as a Mat4 or a 16-element column-major array.
   * @returns A new vector.
   */
  transformByMat4New(m: Mat4Like): Vec3 {
    return this.clone().transformByMat4(m);
  }

  /**
   * Multiply the vector by a 3×3 column-major matrix, in place.
   *
   * @param m The matrix, as a Mat3 or a 9-element column-major array.
   * @returns This vector, for chaining.
   */
  transformByMat3(m: Mat3Like): Vec3 {
    const ma = Array.isArray(m) ? m : m.array;
    const o = this.clone();
    this.x = ma[0] * o.x + ma[3] * o.y + ma[6] * o.z;
    this.y = ma[1] * o.x + ma[4] * o.y + ma[7] * o.z;
    this.z = ma[2] * o.x + ma[5] * o.y + ma[8] * o.z;
    return this;
  }

  /**
   * Like {@link Vec3.transformByMat3}, but returns a new vector and leaves this one unchanged.
   *
   * @param m The matrix, as a Mat3 or a 9-element column-major array.
   * @returns A new vector.
   */
  transformByMat3New(m: Mat3Like): Vec3 {
    return this.clone().transformByMat3(m);
  }

  /**
   * Rotate the vector by a quaternion, in place. The quaternion should be
   * normalised; a non-unit quaternion also scales the result.
   *
   * @param q The quaternion, as a Quat, an `{x, y, z, w}` object or an `[x, y, z, w]` array.
   * @returns This vector, for chaining.
   */
  transformByQuat(q: QuatLike): Vec3 {
    const qa = Array.isArray(q) ? q : [q.x, q.y, q.z, q.w];
    const o = this.clone();
    const uv = new Vec3(
      qa[1] * o.z - qa[2] * o.y,
      qa[2] * o.x - qa[0] * o.z,
      qa[0] * o.y - qa[1] * o.x,
    );
    const uuv = new Vec3(
      qa[1] * uv.z - qa[2] * uv.y,
      qa[2] * uv.x - qa[0] * uv.z,
      qa[0] * uv.y - qa[1] * uv.x,
    );
    uv.scale(2 * qa[3]);
    uuv.scale(2);
    this.add(uv);
    this.add(uuv);
    return this;
  }

  /**
   * Like {@link Vec3.transformByQuat}, but returns a new vector and leaves this one unchanged.
   *
   * @param q The quaternion, as a Quat, an `{x, y, z, w}` object or an `[x, y, z, w]` array.
   * @returns A new vector.
   */
  transformByQuatNew(q: QuatLike): Vec3 {
    return this.clone().transformByQuat(q);
  }

  /**
   * Negate each component, in place.
   *
   * @returns This vector, for chaining.
   */
  negate(): Vec3 {
    return this.multiplyScalar(-1);
  }

  /**
   * Like {@link Vec3.negate}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  negateNew(): Vec3 {
    return this.multiplyScalarNew(-1);
  }

  /**
   * Replace each component with its reciprocal (1 / value), in place. Unlike
   * {@link Vec3.divide}, a zero component becomes `Infinity`.
   *
   * @returns This vector, for chaining.
   */
  inverse(): Vec3 {
    this.x = 1 / this.x;
    this.y = 1 / this.y;
    this.z = 1 / this.z;
    return this;
  }

  /**
   * Like {@link Vec3.inverse}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  inverseNew(): Vec3 {
    const c = this.clone();
    c.x = 1 / c.x;
    c.y = 1 / c.y;
    c.z = 1 / c.z;
    return c;
  }

  /**
   * Scale the vector to a length of 1, in place, keeping its direction. A zero
   * vector stays zero.
   *
   * @returns This vector, for chaining.
   */
  normalise(): Vec3 {
    return this.divideScalar(this.length);
  }
  /**
   * Like {@link Vec3.normalise}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  normaliseNew(): Vec3 {
    return this.divideScalarNew(this.length);
  }

  /**
   * The straight-line distance between this vector and another.
   *
   * @param vector The other vector.
   * @returns The distance.
   */
  distance(vector: Vec3): number {
    return this.subtractNew(vector).length;
  }

  /**
   * The signed distance along x from another vector to this one
   * (`this.x - vector.x`).
   *
   * @param vector The other vector.
   * @returns The difference in x.
   */
  distanceX(vector: Vec3): number {
    return this.x - vector.x;
  }

  /**
   * The signed distance along y from another vector to this one
   * (`this.y - vector.y`).
   *
   * @param vector The other vector.
   * @returns The difference in y.
   */
  distanceY(vector: Vec3): number {
    return this.y - vector.y;
  }

  /**
   * The signed distance along z from another vector to this one
   * (`this.z - vector.z`).
   *
   * @param vector The other vector.
   * @returns The difference in z.
   */
  distanceZ(vector: Vec3): number {
    return this.z - vector.z;
  }

  /**
   * The dot product of this vector and another.
   *
   * @example
   * ```ts
   * new Vec3(1, 2, 3).dot(new Vec3(4, -5, 6)); // 12
   * ```
   *
   * @param vector The other vector.
   * @returns The dot product.
   */
  dot(vector: Vec3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  /**
   * The cross product of this vector and another (`this × vector`). This
   * vector is not changed; the result is always a new vector.
   *
   * @example
   * ```ts
   * new Vec3(1, 0, 0).cross(new Vec3(0, 1, 0)); // Vec3(0, 0, 1)
   * ```
   *
   * @param vector The other vector.
   * @returns A new vector perpendicular to both.
   */
  cross(vector: Vec3): Vec3 {
    return new Vec3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x,
    );
  }

  /**
   * Same as {@link Vec3.cross}: returns the cross product as a new vector and
   * leaves this one unchanged.
   *
   * @param vector The other vector.
   * @returns A new vector perpendicular to both.
   */
  crossNew(vector: Vec3): Vec3 {
    return this.clone().cross(vector);
  }

  /**
   * Round each component up to the nearest integer, in place.
   *
   * @returns This vector, for chaining.
   */
  ceil(): Vec3 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  /**
   * Like {@link Vec3.ceil}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  ceilNew(): Vec3 {
    return this.clone().ceil();
  }

  /**
   * Round each component down to the nearest integer, in place.
   *
   * @returns This vector, for chaining.
   */
  floor(): Vec3 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  /**
   * Like {@link Vec3.floor}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  floorNew(): Vec3 {
    return this.clone().floor();
  }

  /**
   * Round each component to the nearest integer, in place (using `Math.round`,
   * so halves round up).
   *
   * @returns This vector, for chaining.
   */
  round(): Vec3 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  /**
   * Like {@link Vec3.round}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  roundNew(): Vec3 {
    return this.clone().round();
  }

  /**
   * Replace each component with its fractional part (`value - floor(value)`),
   * in place. Results are always in the range [0, 1), including for negative
   * values.
   *
   * @returns This vector, for chaining.
   */
  fract(): Vec3 {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    this.z -= Math.floor(this.z);
    return this;
  }

  /**
   * Like {@link Vec3.fract}, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector.
   */
  fractNew(): Vec3 {
    return this.clone().fract();
  }

  // Getters and setters

  #x: number = 0;
  /**
   * Set the x component. Throws a `TypeError` if the value is not a number.
   *
   * @default 0
   */
  set x(x: number) {
    if (typeof x == "number") {
      this.#x = x;
    } else {
      throw new TypeError("X should be a number");
    }
  }
  /**
   * The x component. `NaN` reads as 0.
   *
   * @default 0
   */
  get x(): number {
    return this.#x || 0;
  }

  #y: number = 0;
  /**
   * Set the y component. Throws a `TypeError` if the value is not a number.
   *
   * @default 0
   */
  set y(y: number) {
    if (typeof y == "number") {
      this.#y = y;
    } else {
      throw new TypeError("Y should be a number");
    }
  }
  /**
   * The y component. `NaN` reads as 0.
   *
   * @default 0
   */
  get y(): number {
    return this.#y || 0;
  }

  #z: number = 0;
  /**
   * Set the z component. Throws a `TypeError` if the value is not a number.
   *
   * @default 0
   */
  set z(z: number) {
    if (typeof z == "number") {
      this.#z = z;
    } else {
      throw new TypeError("Z should be a number");
    }
  }
  /**
   * The z component. `NaN` reads as 0.
   *
   * @default 0
   */
  get z(): number {
    return this.#z || 0;
  }

  /**
   * Scale the vector in place by `value / lengthSquared`. Note this scales by
   * the ratio of squared lengths, so the resulting squared length is not
   * `value` unless the current squared length is 1. Throws a `TypeError` if
   * the value is not a number.
   */
  set lengthSquared(length: number) {
    var factor;
    if (typeof length == "number") {
      factor = length / this.lengthSquared;
      this.multiplyScalar(factor);
    } else {
      throw new TypeError("length should be a number");
    }
  }
  /**
   * The squared length of the vector. Cheaper than {@link Vec3.length}, so
   * use it when only comparing lengths.
   */
  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * Set the length of the vector, scaling it while keeping its direction.
   * Throws a `TypeError` if the value is not a number. A zero vector cannot be
   * scaled and stays zero.
   */
  set length(length: number) {
    var factor;
    if (typeof length == "number") {
      factor = length / this.length;
      this.multiplyScalar(factor);
    } else {
      throw new TypeError("length should be a number");
    }
  }
  /** The length (magnitude) of the vector. */
  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  /**
   * Set the spherical radius. Alias of {@link Vec3.x}. No conversion between
   * spherical and Cartesian coordinates is done.
   */
  set radius(s: number) {
    this.x = s;
  }
  /**
   * The spherical radius, for using the vector to hold spherical coordinates
   * (radius, phi, theta). Alias of {@link Vec3.x}; the value is stored as
   * given, with no conversion.
   */
  get radius(): number {
    return this.x;
  }

  /**
   * Set the spherical angle phi. Alias of {@link Vec3.y}. No conversion
   * between spherical and Cartesian coordinates is done.
   */
  set phi(p: number) {
    this.y = p;
  }
  /**
   * The spherical angle phi, for using the vector to hold spherical
   * coordinates (radius, phi, theta). Alias of {@link Vec3.y}; the value is
   * stored as given, so the unit and convention are up to the caller.
   */
  get phi(): number {
    return this.y;
  }

  /**
   * Set the spherical angle theta. Alias of {@link Vec3.z}. No conversion
   * between spherical and Cartesian coordinates is done.
   */
  set theta(t: number) {
    this.z = t;
  }
  /**
   * The spherical angle theta, for using the vector to hold spherical
   * coordinates (radius, phi, theta). Alias of {@link Vec3.z}; the value is
   * stored as given, so the unit and convention are up to the caller.
   */
  get theta(): number {
    return this.z;
  }

  /** Set the width. Alias of {@link Vec3.x}. */
  set width(w: number) {
    this.x = w;
  }
  /** The width, for using the vector as a size. Alias of {@link Vec3.x}. */
  get width(): number {
    return this.x;
  }

  /** Set the height. Alias of {@link Vec3.y}. */
  set height(h: number) {
    this.y = h;
  }
  /** The height, for using the vector as a size. Alias of {@link Vec3.y}. */
  get height(): number {
    return this.y;
  }

  /** Set the depth. Alias of {@link Vec3.z}. */
  set depth(h: number) {
    this.z = h;
  }
  /** The depth, for using the vector as a size. Alias of {@link Vec3.z}. */
  get depth(): number {
    return this.z;
  }

  /** The product of the components (`x * y * z`): the volume of a box of this size. */
  get area(): number {
    return this.x * this.y * this.z;
  }

  /** The components as a new array: `[x, y, z]`. */
  get array(): number[] {
    return [this.x, this.y, this.z];
  }

  /** The x, y and z components as a new Vec3. */
  get xyz(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }
  /**
   * Set x, y and z from a Vec3, an `{x, y, z}` object or an `[x, y, z]` array.
   * For arrays, missing or `NaN` values become 0.
   */
  set xyz(v: Vec3Like) {
    if (Array.isArray(v)) {
      this.reset(v[0], v[1], v[2]);
    } else {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    }
  }

  /** The y, z and x components as a new Vec3. */
  get yzx(): Vec3 {
    return new Vec3(this.y, this.z, this.x);
  }
  /**
   * Set the components from a Vec3 or array by reading the value's own y, z
   * and x components into x, y and z. So `v.yzx = [a, b, c]` gives
   * `x = b, y = c, z = a`, which is not the inverse of the getter.
   */
  set yzx(v: Vec3Like) {
    this.xyz = Vec3.interpolate(v).yzx;
  }

  /** The z, x and y components as a new Vec3. */
  get zxy(): Vec3 {
    return new Vec3(this.z, this.x, this.y);
  }
  /**
   * Set the components from a Vec3 or array by reading the value's own z, x
   * and y components into x, y and z. So `v.zxy = [a, b, c]` gives
   * `x = c, y = a, z = b`, which is not the inverse of the getter.
   */
  set zxy(v: Vec3Like) {
    this.xyz = Vec3.interpolate(v).zxy;
  }

  /** The x and y components as a new Vec2. */
  get xy(): Vec2 {
    return new Vec2(this.x, this.y);
  }
  /** Set x and y from a Vec2 or array. z is unchanged. */
  set xy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.y = v.y;
  }

  /** The y and z components as a new Vec2. */
  get yz(): Vec2 {
    return new Vec2(this.y, this.z);
  }
  /** Set y and z from a Vec2 or array. x is unchanged. */
  set yz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.z = v.y;
  }

  /** The z and x components as a new Vec2. */
  get zx(): Vec2 {
    return new Vec2(this.z, this.x);
  }
  /** Set z and x from a Vec2 or array. y is unchanged. */
  set zx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.x = v.y;
  }

  /** The y and x components as a new Vec2. */
  get yx(): Vec2 {
    return new Vec2(this.y, this.x);
  }
  /** Set y and x from a Vec2 or array. z is unchanged. */
  set yx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.y;
    this.y = v.x;
  }

  /** The z and y components as a new Vec2. */
  get zy(): Vec2 {
    return new Vec2(this.z, this.y);
  }
  /**
   * Set z and y from a Vec2 or array. x is unchanged. Note that the current
   * code assigns the first value to y and the second to z, the same as
   * {@link Vec3.yz}.
   */
  set zy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.y;
    this.y = v.x;
  }

  /** The x component twice, as a new Vec2. */
  get xx(): Vec2 {
    return new Vec2(this.x, this.x);
  }
  /** Set x from the second value of a Vec2 or array. y and z are unchanged. */
  set xx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.y;
  }

  /** The y component twice, as a new Vec2. */
  get yy(): Vec2 {
    return new Vec2(this.y, this.y);
  }
  /** Set y from the second value of a Vec2 or array. x and z are unchanged. */
  set yy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.y = v.y;
  }

  /** The z component twice, as a new Vec2. */
  get zz(): Vec2 {
    return new Vec2(this.z, this.z);
  }
  /** Set z from the second value of a Vec2 or array. x and y are unchanged. */
  set zz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.y;
  }

  // Static methods

  /**
   * Create a new Vec3 from a loosely typed value.
   *
   * - A number sets all three components to it. `NaN` throws.
   * - A string is read as comma-separated `"x,y,z"`. Throws if there are fewer
   *   than three values or any of the first three is not a number.
   * - An array is read as `[x, y, z]`; missing or `NaN` values become 0.
   * - Any other object is read from its `x`, `y` and `z` properties.
   *
   * @param v The value to convert.
   * @returns A new vector.
   */
  static interpolate(v: Vec3Like | number | string): Vec3 {
    if (typeof v === "number") {
      // Single number
      if (isNaN(v))
        throw new Error(
          "The passed interpolant could not be parsed into a Vec3",
        );
      return new Vec3(v, v, v);
    } else if (typeof v === "string") {
      // Comma-delimited string
      const nv = v.split(",");
      const x: number = Number(nv[0]);
      const y: number = Number(nv[1]);
      const z: number = Number(nv[2]);
      if (nv.length >= 3 && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
        return new Vec3(x, y, z);
      } else {
        throw new Error(
          "The passed interpolant could not be parsed into a Vec3",
        );
      }
    } else if (Array.isArray(v)) {
      // 3-dimensional array
      return new Vec3(v[0], v[1], v[2]);
    } else {
      // Vec3 or Vec3-like object
      return new Vec3(v.x, v.y, v.z);
    }
  }

  /**
   * Linearly interpolate between two vectors. `d` is not clamped, so values
   * outside 0 to 1 extrapolate.
   *
   * @param v1 The start vector, returned when `d` is 0.
   * @param v2 The end vector, returned when `d` is 1.
   * @param d The interpolation amount.
   * @returns A new vector.
   */
  static lerp(v1: Vec3, v2: Vec3, d: number): Vec3 {
    return new Vec3(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y),
      v1.z + d * (v2.z - v1.z),
    );
  }

  /**
   * The angle between two vectors, in radians, from 0 to π. If either vector
   * has zero length the result is π / 2.
   *
   * @param a The first vector.
   * @param b The second vector.
   * @returns The angle in radians.
   */
  static getAngle(a: Vec3, b: Vec3) {
    let len1 = a.lengthSquared;
    if (len1 > 0) len1 = 1 / Math.sqrt(len1);

    let len2 = b.lengthSquared;
    if (len2 > 0) len2 = 1 / Math.sqrt(len2);

    const cosine = (a.x * b.x + a.y * b.y + a.z * b.z) * len1 * len2;

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }

  /**
   * Extract Euler angles, in radians, from the rotation part of a 4×4
   * column-major matrix. The upper 3×3 must be a pure rotation (no scale).
   *
   * Follows the same convention as three.js's `Euler.setFromRotationMatrix`:
   * the order names the axes in the order the matrix is composed, so `"XYZ"`
   * means the matrix is Rx · Ry · Rz. Supported orders are `"XYZ"`, `"YXZ"`,
   * `"ZXY"`, `"ZYX"`, `"YZX"` and `"XZY"`; any other string returns
   * (0, 0, 0). At gimbal lock (the middle angle at ±90°) the third angle is
   * set to 0 and the rotation is put in the first.
   *
   * @param m The matrix, as a Mat4 or a 16-element column-major array.
   * @param order The rotation order.
   * @returns A new vector holding the rotation about x, y and z, in radians.
   */
  static fromRotationMatrix(m: Mat4Like, order: string = "YXZ"): Vec3 {
    const ma = Array.isArray(m) ? m : m.array;
    const v = new Vec3();
    if (order === "XYZ") {
      v.y = Math.asin(Math.min(Math.max(ma[8], -1), 1));
      if (Math.abs(ma[8]) < 0.99999) {
        v.x = Math.atan2(-ma[9], ma[10]);
        v.z = Math.atan2(-ma[4], ma[0]);
      } else {
        v.x = Math.atan2(ma[6], ma[5]);
        v.z = 0;
      }
    } else if (order === "YXZ") {
      v.x = Math.asin(-Math.min(Math.max(ma[9], -1), 1));
      if (Math.abs(ma[9]) < 0.99999) {
        v.y = Math.atan2(ma[8], ma[10]);
        v.z = Math.atan2(ma[1], ma[5]);
      } else {
        v.y = Math.atan2(-ma[2], ma[0]);
        v.z = 0;
      }
    } else if (order === "ZXY") {
      v.x = Math.asin(Math.min(Math.max(ma[6], -1), 1));
      if (Math.abs(ma[6]) < 0.99999) {
        v.y = Math.atan2(-ma[2], ma[10]);
        v.z = Math.atan2(-ma[4], ma[5]);
      } else {
        v.y = 0;
        v.z = Math.atan2(ma[1], ma[0]);
      }
    } else if (order === "ZYX") {
      v.y = Math.asin(-Math.min(Math.max(ma[2], -1), 1));
      if (Math.abs(ma[2]) < 0.99999) {
        v.x = Math.atan2(ma[6], ma[10]);
        v.z = Math.atan2(ma[1], ma[0]);
      } else {
        v.x = 0;
        v.z = Math.atan2(-ma[4], ma[5]);
      }
    } else if (order === "YZX") {
      v.z = Math.asin(Math.min(Math.max(ma[1], -1), 1));
      if (Math.abs(ma[1]) < 0.99999) {
        v.x = Math.atan2(-ma[9], ma[5]);
        v.y = Math.atan2(-ma[2], ma[0]);
      } else {
        v.x = 0;
        v.y = Math.atan2(ma[8], ma[10]);
      }
    } else if (order === "XZY") {
      v.z = Math.asin(-Math.min(Math.max(ma[4], -1), 1));
      if (Math.abs(ma[4]) < 0.99999) {
        v.x = Math.atan2(ma[6], ma[5]);
        v.y = Math.atan2(ma[8], ma[0]);
      } else {
        v.x = Math.atan2(-ma[9], ma[10]);
        v.y = 0;
      }
    }
    return v;
  }

  /** Iterate over the components, so the vector can be spread or destructured: `const [x, y, z] = v`. */
  [Symbol.iterator](): Iterator<number> {
    return this.array[Symbol.iterator]();
  }
}

export { Vec3 };
