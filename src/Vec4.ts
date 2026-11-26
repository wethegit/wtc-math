import { Vec2 } from "./Vec2.js";
import { Vec3 } from "./Vec3.js";
import type { Vec2Like, Vec3Like, Vec4Like, QuatLike, Mat4Like } from "./types.js";

interface V4Q {
  x: number;
  y: number;
  z: number;
  w: number;
  length: number;
  lengthSquared: number;
  width: number;
  height: number;
  depth: number;
  area: number;
  array: number[];
  xyzw: Vec4Like;
  yzwx: Vec4Like;
  zwxy: Vec4Like;
  wxyz: Vec4Like;
  xyz: Vec3Like;
  yzx: Vec3Like;
  zxy: Vec3Like;
  xx: Vec2Like;
  xy: Vec2Like;
  xz: Vec2Like;
  xw: Vec2Like;
  yx: Vec2Like;
  yy: Vec2Like;
  yz: Vec2Like;
  yw: Vec2Like;
  zx: Vec2Like;
  zy: Vec2Like;
  zz: Vec2Like;
  zw: Vec2Like;
  wx: Vec2Like;
  wy: Vec2Like;
  wz: Vec2Like;
  ww: Vec2Like;
  reset(...args: number[]): V4Q;
  resetToVector(v: V4Q): V4Q;
  clone(): V4Q;
  rotateX(origin: V4Q, rad: number): V4Q;
  rotateXNew(origin: V4Q, rad: number): V4Q;
  rotateY(origin: V4Q, rad: number): V4Q;
  rotateYNew(origin: V4Q, rad: number): V4Q;
  rotateZ(origin: V4Q, rad: number): V4Q;
  rotateZNew(origin: V4Q, rad: number): V4Q;
  add(vector: V4Q): V4Q;
  addNew(vector: V4Q): V4Q;
  addScalar(scalar: number): V4Q;
  addScalarNew(scalar: number): V4Q;
  subtract(vector: V4Q): V4Q;
  subtractNew(vector: V4Q): V4Q;
  subtractScalar(scalar: number): V4Q;
  subtractScalarNew(scalar: number): V4Q;
  divide(vector: V4Q): V4Q;
  divideNew(vector: V4Q): V4Q;
  divideScalar(scalar: number): V4Q;
  divideScalarNew(scalar: number): V4Q;
  multiply(q: V4Q): V4Q;
  multiplyNew(q: V4Q): V4Q;
  multiplyScalar(scalar: number): V4Q;
  multiplyScalarNew(scalar: number): V4Q;
  scale(scalar: number): V4Q;
  scaleNew(scalar: number): V4Q;
  transformByMat4(m: Mat4Like): V4Q;
  transformByMat4New(m: Mat4Like): V4Q;
  transformByQuat(q: QuatLike): V4Q;
  transformByQuatNew(q: QuatLike): V4Q;
  negate(): V4Q;
  negateNew(): V4Q;
  inverse(): V4Q;
  inverseNew(): V4Q;
  normalise(): V4Q;
  normaliseNew(): V4Q;
  distance(vector: V4Q): number;
  distanceX(vector: V4Q): number;
  distanceY(vector: V4Q): number;
  distanceZ(vector: V4Q): number;
  distanceW(vector: V4Q): number;
  dot(vector: V4Q): number;
  cross(v: V4Q, w: V4Q): V4Q;
  crossNew(v: V4Q, w: V4Q): V4Q;
  ceil(): V4Q;
  ceilNew(): V4Q;
  floor(): V4Q;
  floorNew(): V4Q;
  round(): V4Q;
  roundNew(): V4Q;
  fract(): V4Q;
  fractNew(): V4Q;
}

/**
 * A four-component vector with x, y, z and w components.
 *
 * Most operations come in two forms: one that changes the vector in place and
 * returns it for chaining (`add`), and a `…New` variant that returns a new
 * vector and leaves the original unchanged (`addNew`). Components are exposed
 * through getters and setters, along with derived values such as `length` and
 * swizzles such as `xyz`.
 *
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec4 implements V4Q {
  /**
   * Create a new vector. Missing or `NaN` components default to 0.
   *
   * @param args The x, y, z and w components, in that order.
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Set the components in place. Missing or `NaN` components are set to 0.
   *
   * @param args The x, y, z and w components, in that order.
   * @returns This vector, for chaining.
   */
  reset(...args: number[]): V4Q {
    let [x, y, z, w] = args;
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(z)) z = 0;
    if (isNaN(w)) w = 0;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Copy the components of another vector into this one, in place. Does
   * nothing if `v` is not a Vec4 instance (a Quat counts, as it extends Vec4).
   *
   * @param v The vector to copy from.
   * @returns This vector, for chaining.
   */
  resetToVector(v: V4Q): V4Q {
    if (v instanceof Vec4) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;
    }
    return this;
  }

  /**
   * Create a copy of this vector.
   *
   * @returns A new Vec4 with the same components.
   */
  clone(): V4Q {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /**
   * Add another vector to this one, component by component, in place.
   *
   * @param vector The vector to add.
   * @returns This vector, for chaining.
   */
  add(vector: V4Q): V4Q {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }
  /**
   * Like `add`, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to add.
   * @returns A new vector holding the sum.
   */
  addNew(vector: V4Q): V4Q {
    return this.clone().add(vector);
  }

  /**
   * Add a scalar to every component, in place.
   *
   * @param scalar The value to add to x, y, z and w.
   * @returns This vector, for chaining.
   */
  addScalar(scalar: number): V4Q {
    return this.add(new Vec4(scalar, scalar, scalar, scalar));
  }
  /**
   * Like `addScalar`, but returns a new vector and leaves this one unchanged.
   *
   * @param scalar The value to add to x, y, z and w.
   * @returns A new vector holding the result.
   */
  addScalarNew(scalar: number): V4Q {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtract another vector from this one, component by component, in place.
   *
   * @param vector The vector to subtract.
   * @returns This vector, for chaining.
   */
  subtract(vector: V4Q): V4Q {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    this.w -= vector.w;
    return this;
  }
  /**
   * Like `subtract`, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to subtract.
   * @returns A new vector holding the difference.
   */
  subtractNew(vector: V4Q): V4Q {
    return this.clone().subtract(vector);
  }

  /**
   * Subtract a scalar from every component, in place.
   *
   * @param scalar The value to subtract from x, y, z and w.
   * @returns This vector, for chaining.
   */
  subtractScalar(scalar: number): V4Q {
    return this.subtract(new Vec4(scalar, scalar, scalar, scalar));
  }
  /**
   * Like `subtractScalar`, but returns a new vector and leaves this one
   * unchanged.
   *
   * @param scalar The value to subtract from x, y, z and w.
   * @returns A new vector holding the result.
   */
  subtractScalarNew(scalar: number): V4Q {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divide this vector by another, component by component, in place. Any
   * component divided by 0 is set to 0 rather than `Infinity`.
   *
   * @param vector The vector to divide by.
   * @returns This vector, for chaining.
   */
  divide(vector: V4Q): V4Q {
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
    if (vector.w !== 0) {
      this.w /= vector.w;
    } else {
      this.w = 0;
    }
    return this;
  }
  /**
   * Like `divide`, but returns a new vector and leaves this one unchanged.
   *
   * @param vector The vector to divide by.
   * @returns A new vector holding the quotient.
   */
  divideNew(vector: V4Q): V4Q {
    return this.clone().divide(vector);
  }

  /**
   * Divide every component by a scalar, in place. Dividing by 0 sets every
   * component to 0.
   *
   * @param scalar The value to divide x, y, z and w by.
   * @returns This vector, for chaining.
   */
  divideScalar(scalar: number): V4Q {
    var v = new Vec4(scalar, scalar, scalar, scalar);
    return this.divide(v);
  }
  /**
   * Like `divideScalar`, but returns a new vector and leaves this one
   * unchanged.
   *
   * @param scalar The value to divide x, y, z and w by.
   * @returns A new vector holding the result.
   */
  divideScalarNew(scalar: number): V4Q {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiply this vector by another, component by component, in place.
   *
   * @param vector The vector to multiply by.
   * @returns This vector, for chaining.
   */
  multiply(vector: V4Q): V4Q {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }
  /**
   * Like `multiply`, but returns a new vector and leaves this one unchanged.
   *
   * @param q The vector to multiply by.
   * @returns A new vector holding the product.
   */
  multiplyNew(q: V4Q): V4Q {
    return this.clone().multiply(q);
  }

  /**
   * Multiply every component by a scalar, in place.
   *
   * @param scalar The value to multiply x, y, z and w by.
   * @returns This vector, for chaining.
   */
  multiplyScalar(scalar: number): V4Q {
    var v: Vec4 = new Vec4(scalar, scalar, scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Like `multiplyScalar`, but returns a new vector and leaves this one
   * unchanged.
   *
   * @param scalar The value to multiply x, y, z and w by.
   * @returns A new vector holding the result.
   */
  multiplyScalarNew(scalar: number): V4Q {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of `multiplyScalar`: multiply every component by a scalar, in place.
   *
   * @param scalar The value to multiply x, y, z and w by.
   * @returns This vector, for chaining.
   */
  scale(scalar: number): V4Q {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of `multiplyScalarNew`: like `scale`, but returns a new vector and
   * leaves this one unchanged.
   *
   * @param scalar The value to multiply x, y, z and w by.
   * @returns A new vector holding the result.
   */
  scaleNew(scalar: number): V4Q {
    return this.multiplyScalarNew(scalar);
  }

  /**
   * Rotate the vector around the X axis through a point, in place. Only y and
   * z change; x and w are left as they are.
   *
   * @param origin The point to rotate around. Only its y and z are used.
   * @param radian The angle in radians.
   * @returns This vector, for chaining.
   */
  rotateX(origin: V4Q, radian: number): V4Q {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const ty = translated.y;

    this.y = ty * c - translated.z * s + origin.y;
    this.z = ty * s + translated.z * c + origin.z;

    return this;
  }

  /**
   * Like `rotateX`, but returns a new vector and leaves this one unchanged.
   *
   * @param origin The point to rotate around.
   * @param radian The angle in radians.
   * @returns A new, rotated copy.
   */
  rotateXNew(origin: V4Q, radian: number): V4Q {
    return this.clone().rotateX(origin, radian);
  }

  /**
   * Rotate the vector around the Y axis through a point, in place. Only x and
   * z change; y and w are left as they are.
   *
   * @param origin The point to rotate around. Only its x and z are used.
   * @param radian The angle in radians.
   * @returns This vector, for chaining.
   */
  rotateY(origin: V4Q, radian: number): V4Q {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const tx = translated.x;

    this.x = tx * c + translated.z * s + origin.x;
    this.z = translated.z * c - tx * s + origin.z;

    return this;
  }

  /**
   * Like `rotateY`, but returns a new vector and leaves this one unchanged.
   *
   * @param origin The point to rotate around.
   * @param radian The angle in radians.
   * @returns A new, rotated copy.
   */
  rotateYNew(origin: V4Q, radian: number): V4Q {
    return this.clone().rotateY(origin, radian);
  }

  /**
   * Rotate the vector around the Z axis through a point, in place. Only x and
   * y change; z and w are left as they are.
   *
   * @param origin The point to rotate around. Only its x and y are used.
   * @param radian The angle in radians.
   * @returns This vector, for chaining.
   */
  rotateZ(origin: V4Q, radian: number): V4Q {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const tx = translated.x;

    this.x = tx * c - translated.y * s + origin.x;
    this.y = tx * s + translated.y * c + origin.y;

    return this;
  }

  /**
   * Like `rotateZ`, but returns a new vector and leaves this one unchanged.
   *
   * @param origin The point to rotate around.
   * @param radian The angle in radians.
   * @returns A new, rotated copy.
   */
  rotateZNew(origin: V4Q, radian: number): V4Q {
    return this.clone().rotateZ(origin, radian);
  }

  /**
   * Multiply the vector by a 4×4 matrix (`m × v`), in place. The matrix is
   * read in column-major order, as WebGL uses.
   *
   * @param m The matrix, as a Mat4 or a 16-element array.
   * @returns This vector, for chaining.
   */
  transformByMat4(m: Mat4Like): V4Q {
    const ma = Array.isArray(m) ? m : m.array;
    const o = this.clone();
    this.x = ma[0] * o.x + ma[4] * o.y + ma[8]  * o.z + ma[12] * o.w;
    this.y = ma[1] * o.x + ma[5] * o.y + ma[9]  * o.z + ma[13] * o.w;
    this.z = ma[2] * o.x + ma[6] * o.y + ma[10] * o.z + ma[14] * o.w;
    this.w = ma[3] * o.x + ma[7] * o.y + ma[11] * o.z + ma[15] * o.w;
    return this;
  }

  /**
   * Like `transformByMat4`, but returns a new vector and leaves this one
   * unchanged.
   *
   * @param m The matrix, as a Mat4 or a 16-element array.
   * @returns A new, transformed vector.
   */
  transformByMat4New(m: Mat4Like): V4Q {
    return this.clone().transformByMat4(m);
  }

  /**
   * Rotate the x, y and z components by a quaternion, in place. w is left as
   * it is. The quaternion should be normalised.
   *
   * @param q The quaternion, as a Quat or an `[x, y, z, w]` array.
   * @returns This vector, for chaining.
   */
  transformByQuat(q: QuatLike): V4Q {
    const qa = Array.isArray(q) ? q : [q.x, q.y, q.z, q.w];
    const uv = new Vec4(
      qa[3] * this.x + qa[1] * this.z - qa[2] * this.y,
      qa[3] * this.y + qa[2] * this.x - qa[0] * this.z,
      qa[3] * this.z + qa[0] * this.y - qa[1] * this.x,
      -qa[0] * this.x - qa[1] * this.y - qa[2] * this.z
    );
    this.x = uv.x * qa[3] + uv.w * -qa[0] + uv.y * -qa[2] - uv.z * -qa[1];
    this.y = uv.y * qa[3] + uv.w * -qa[1] + uv.z * -qa[0] - uv.x * -qa[2];
    this.z = uv.z * qa[3] + uv.w * -qa[2] + uv.x * -qa[1] - uv.y * -qa[0];
    return this;
  }

  /**
   * Like `transformByQuat`, but returns a new vector and leaves this one
   * unchanged.
   *
   * @param q The quaternion, as a Quat or an `[x, y, z, w]` array.
   * @returns A new, rotated vector.
   */
  transformByQuatNew(q: QuatLike): V4Q {
    return this.clone().transformByQuat(q);
  }

  /**
   * Negate every component, in place.
   *
   * @returns This vector, for chaining.
   */
  negate(): V4Q {
    return this.multiplyScalar(-1);
  }

  /**
   * Like `negate`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new, negated vector.
   */
  negateNew(): V4Q {
    return this.multiplyScalarNew(-1);
  }

  /**
   * Replace every component with its reciprocal (`1 / n`), in place. A 0
   * component stays 0, as in `divide`.
   *
   * @returns This vector, for chaining.
   */
  inverse(): V4Q {
    this.x = this.x === 0 ? 0 : 1 / this.x;
    this.y = this.y === 0 ? 0 : 1 / this.y;
    this.z = this.z === 0 ? 0 : 1 / this.z;
    this.w = this.w === 0 ? 0 : 1 / this.w;
    return this;
  }

  /**
   * Like `inverse`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector holding the reciprocals.
   */
  inverseNew(): V4Q {
    return this.clone().inverse();
  }

  /**
   * Scale the vector to a length of 1, in place. A zero-length vector becomes
   * `(0, 0, 0, 1)`.
   *
   * @returns This vector, for chaining.
   */
  normalise(): V4Q {
    const l: number = this.length;
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      this.divideScalar(l);
    }
    return this;
  }
  /**
   * Like `normalise`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new, normalised vector.
   */
  normaliseNew(): V4Q {
    return this.clone().normalise();
  }

  /**
   * The distance between this vector and another.
   *
   * @param vector The other vector.
   * @returns The length of the difference between the two vectors.
   */
  distance(vector: V4Q): number {
    return this.subtractNew(vector).length;
  }

  /**
   * The signed difference between the x components of this vector and another.
   *
   * @param vector The other vector.
   * @returns `this.x - vector.x`. Can be negative.
   */
  distanceX(vector: V4Q): number {
    return this.x - vector.x;
  }

  /**
   * The signed difference between the y components of this vector and another.
   *
   * @param vector The other vector.
   * @returns `this.y - vector.y`. Can be negative.
   */
  distanceY(vector: V4Q): number {
    return this.y - vector.y;
  }

  /**
   * The signed difference between the z components of this vector and another.
   *
   * @param vector The other vector.
   * @returns `this.z - vector.z`. Can be negative.
   */
  distanceZ(vector: V4Q): number {
    return this.z - vector.z;
  }

  /**
   * The signed difference between the w components of this vector and another.
   *
   * @param vector The other vector.
   * @returns `this.w - vector.w`. Can be negative.
   */
  distanceW(vector: V4Q): number {
    return this.w - vector.w;
  }

  /**
   * The dot product of this vector and another.
   *
   * @example
   * ```ts
   * new Vec4(1, 2, 3, 4).dot(new Vec4(5, 6, 7, 8)); // 70
   * ```
   *
   * @param vector The other vector.
   * @returns The sum of the products of the matching components.
   */
  dot(vector: V4Q): number {
    return (
      this.x * vector.x +
      this.y * vector.y +
      this.z * vector.z +
      this.w * vector.w
    );
  }

  /**
   * Replace this vector with the four-dimensional cross product of itself
   * and two others: a vector perpendicular to all three. In place.
   *
   * @param v The second vector.
   * @param w The third vector.
   * @returns This vector, for chaining.
   */
  cross(v: V4Q, w: V4Q): V4Q {
    const A = v.x * w.y - v.y * w.x,
      B = v.x * w.z - v.z * w.x,
      C = v.x * w.w - v.w * w.x,
      D = v.y * w.z - v.z * w.y,
      E = v.y * w.w - v.w * w.y,
      F = v.z * w.w - v.w * w.z,
      G = this.x,
      H = this.y,
      I = this.z,
      J = this.w;

    return this.reset(
      H * F - I * E + J * D,
      -(G * F) + I * C - J * B,
      G * E - H * C + J * A,
      -(G * D) + H * B - I * A
    );
  }

  /**
   * Like `cross`, but returns a new vector and leaves this one unchanged.
   *
   * @param v The second vector.
   * @param w The third vector.
   * @returns A new Vec4 holding the result.
   */
  crossNew(v: V4Q, w: V4Q): V4Q {
    return this.clone().cross(v, w);
  }

  /**
   * Round every component up to the nearest integer, in place.
   *
   * @returns This vector, for chaining.
   */
  ceil(): V4Q {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }

  /**
   * Like `ceil`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new, rounded vector.
   */
  ceilNew(): V4Q {
    return this.clone().ceil();
  }

  /**
   * Round every component down to the nearest integer, in place.
   *
   * @returns This vector, for chaining.
   */
  floor(): V4Q {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }

  /**
   * Like `floor`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new, rounded vector.
   */
  floorNew(): V4Q {
    return this.clone().floor();
  }

  /**
   * Round every component to the nearest integer, in place, using
   * `Math.round` (halves round up).
   *
   * @returns This vector, for chaining.
   */
  round(): V4Q {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }

  /**
   * Like `round`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new, rounded vector.
   */
  roundNew(): V4Q {
    return this.clone().round();
  }

  /**
   * Replace every component with its fractional part (`n - floor(n)`), in
   * place. Results are always in the range [0, 1), including for negative
   * values.
   *
   * @returns This vector, for chaining.
   */
  fract(): V4Q {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    this.z -= Math.floor(this.z);
    this.w -= Math.floor(this.w);
    return this;
  }

  /**
   * Like `fract`, but returns a new vector and leaves this one unchanged.
   *
   * @returns A new vector holding the fractional parts.
   */
  fractNew(): V4Q {
    return this.clone().fract();
  }

  // Getters and setters

  private _x: number = 0;
  /**
   * Set the x component. Throws a `TypeError` if the value is not a number.
   * `NaN` is stored as 0.
   */
  set x(x) {
    if (typeof x == "number") {
      this._x = x || 0;
    } else {
      throw new TypeError("X should be a number");
    }
  }
  /**
   * The x component of the vector.
   *
   * @default 0
   */
  get x() {
    return this._x || 0;
  }

  private _y: number = 0;
  /**
   * Set the y component. Throws a `TypeError` if the value is not a number.
   * `NaN` is stored as 0.
   */
  set y(y) {
    if (typeof y == "number") {
      this._y = y || 0;
    } else {
      throw new TypeError("Y should be a number");
    }
  }
  /**
   * The y component of the vector.
   *
   * @default 0
   */
  get y() {
    return this._y || 0;
  }

  private _z: number = 0;
  /**
   * Set the z component. Throws a `TypeError` if the value is not a number.
   * `NaN` is stored as 0.
   */
  set z(z) {
    if (typeof z == "number") {
      this._z = z || 0;
    } else {
      throw new TypeError("Z should be a number");
    }
  }
  /**
   * The z component of the vector.
   *
   * @default 0
   */
  get z() {
    return this._z || 0;
  }

  private _w: number = 0;
  /**
   * Set the w component. Throws a `TypeError` if the value is not a number.
   * `NaN` is stored as 0.
   */
  set w(w) {
    if (typeof w == "number") {
      this._w = w || 0;
    } else {
      throw new TypeError("W should be a number");
    }
  }
  /**
   * The w component of the vector.
   *
   * @default 0
   */
  get w() {
    return this._w || 0;
  }

  /**
   * Set the squared length of the vector, scaling it while keeping its
   * direction. A zero-length vector cannot be scaled and stays zero. Throws a
   * `TypeError` if the value is not a number.
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
   * The squared length of the vector. Quicker than `length` when you only
   * need to compare lengths.
   */
  get lengthSquared(): number {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  /**
   * Set the length of the vector, scaling it while keeping its direction.
   * A zero-length vector cannot be scaled and stays zero. Throws a
   * `TypeError` if the value is not a number.
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

  /** Set the x component. Alias of `x`. */
  set width(w: number) {
    this.x = w;
  }
  /** The x component. Alias of `x`, for vectors used as sizes. */
  get width(): number {
    return this.x;
  }

  /** Set the y component. Alias of `y`. */
  set height(h: number) {
    this.y = h;
  }
  /** The y component. Alias of `y`, for vectors used as sizes. */
  get height(): number {
    return this.y;
  }

  /** Set the z component. Alias of `z`. */
  set depth(h: number) {
    this.z = h;
  }
  /** The z component. Alias of `z`, for vectors used as sizes. */
  get depth(): number {
    return this.z;
  }

  /** The product of all four components (`x * y * z * w`). Read-only. */
  get area(): number {
    return this.x * this.y * this.z * this.w;
  }

  /** The components as a new `[x, y, z, w]` array. Read-only. */
  get array(): number[] {
    return [this.x, this.y, this.z, this.w];
  }

  /** The x, y, z and w components as a new Vec4. */
  get xyzw(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
  /** Set x, y, z and w from a Vec4 or array, in that order. */
  set xyzw(v: Vec4Like) {
    if (Array.isArray(v)) {
      this.x = v[0]; this.y = v[1]; this.z = v[2]; this.w = v[3];
    } else {
      this.x = v.x; this.y = v.y; this.z = v.z; this.w = v.w;
    }
  }

  /** The y, z, w and x components as a new Vec4. */
  get yzwx(): Vec4 {
    return new Vec4(this.y, this.z, this.w, this.x);
  }
  /** Set y, z, w and x from a Vec4 or array, in that order. */
  set yzwx(v: Vec4Like) {
    if (Array.isArray(v)) {
      this.y = v[0]; this.z = v[1]; this.w = v[2]; this.x = v[3];
    } else {
      this.y = v.x; this.z = v.y; this.w = v.z; this.x = v.w;
    }
  }

  /** The z, w, x and y components as a new Vec4. */
  get zwxy(): Vec4 {
    return new Vec4(this.z, this.w, this.x, this.y);
  }
  /** Set z, w, x and y from a Vec4 or array, in that order. */
  set zwxy(v: Vec4Like) {
    if (Array.isArray(v)) {
      this.z = v[0]; this.w = v[1]; this.x = v[2]; this.y = v[3];
    } else {
      this.z = v.x; this.w = v.y; this.x = v.z; this.y = v.w;
    }
  }

  /** The w, x, y and z components as a new Vec4. */
  get wxyz(): Vec4 {
    return new Vec4(this.w, this.x, this.y, this.z);
  }
  /** Set w, x, y and z from a Vec4 or array, in that order. */
  set wxyz(v: Vec4Like) {
    if (Array.isArray(v)) {
      this.w = v[0]; this.x = v[1]; this.y = v[2]; this.z = v[3];
    } else {
      this.w = v.x; this.x = v.y; this.y = v.z; this.z = v.w;
    }
  }

  // I'm skipping all the silly combinations of 4 here because they're largely useless

  /** The x, y and z components as a new Vec3. */
  get xyz(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }
  /** Set x, y and z from a Vec3 or array, in that order. w is unchanged. */
  set xyz(v: Vec3Like) {
    if (Array.isArray(v)) {
      this.x = v[0];
      this.y = v[1];
      this.z = v[2];
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
   * Set y, z and x, in that order, from a Vec3 or array. So
   * `v.yzx = [a, b, c]` gives `y = a, z = b, x = c`. w is unchanged.
   */
  set yzx(v: Vec3Like) {
    const r = Vec3.interpolate(v);
    this.y = r.x;
    this.z = r.y;
    this.x = r.z;
  }

  /** The z, x and y components as a new Vec3. */
  get zxy(): Vec3 {
    return new Vec3(this.z, this.x, this.y);
  }
  /**
   * Set z, x and y, in that order, from a Vec3 or array. So
   * `v.zxy = [a, b, c]` gives `z = a, x = b, y = c`. w is unchanged.
   */
  set zxy(v: Vec3Like) {
    const r = Vec3.interpolate(v);
    this.z = r.x;
    this.x = r.y;
    this.y = r.z;
  }

  /** The x component twice, as a new Vec2. */
  get xx(): Vec2 {
    return new Vec2(this.x, this.x);
  }
  /**
   * Set x from the first component of a Vec2 or array. The second component
   * is ignored.
   */
  set xx(v: Vec2Like) {
    this.x = Vec2.interpolate(v).x;
  }

  /** The x and y components as a new Vec2. */
  get xy(): Vec2 {
    return new Vec2(this.x, this.y);
  }
  /** Set x and y from a Vec2 or array, in that order. */
  set xy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.y = v.y;
  }

  /** The x and z components as a new Vec2. */
  get xz(): Vec2 {
    return new Vec2(this.x, this.z);
  }
  /** Set x and z from a Vec2 or array, in that order. */
  set xz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.z = v.y;
  }

  /** The x and w components as a new Vec2. */
  get xw(): Vec2 {
    return new Vec2(this.x, this.w);
  }
  /** Set x and w from a Vec2 or array, in that order. */
  set xw(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.w = v.y;
  }

  /** The y and x components as a new Vec2. */
  get yx(): Vec2 {
    return new Vec2(this.y, this.x);
  }
  /** Set y and x from a Vec2 or array, in that order. */
  set yx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.y;
    this.y = v.x;
  }

  /** The y component twice, as a new Vec2. */
  get yy(): Vec2 {
    return new Vec2(this.y, this.y);
  }
  /**
   * Set y from the first component of a Vec2 or array. The second component
   * is ignored.
   */
  set yy(v: Vec2Like) {
    this.y = Vec2.interpolate(v).x;
  }

  /** The y and z components as a new Vec2. */
  get yz(): Vec2 {
    return new Vec2(this.y, this.z);
  }
  /** Set y and z from a Vec2 or array, in that order. */
  set yz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.z = v.y;
  }

  /** The y and w components as a new Vec2. */
  get yw(): Vec2 {
    return new Vec2(this.y, this.w);
  }
  /** Set y and w from a Vec2 or array, in that order. */
  set yw(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.w = v.y;
  }

  /** The z and x components as a new Vec2. */
  get zx(): Vec2 {
    return new Vec2(this.z, this.x);
  }
  /** Set z and x from a Vec2 or array, in that order. */
  set zx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.x = v.y;
  }

  /** The z and y components as a new Vec2. */
  get zy(): Vec2 {
    return new Vec2(this.z, this.y);
  }
  /** Set z and y from a Vec2 or array, in that order. */
  set zy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.y = v.y;
  }

  /** The z component twice, as a new Vec2. */
  get zz(): Vec2 {
    return new Vec2(this.z, this.z);
  }
  /**
   * Set z from the first component of a Vec2 or array. The second component
   * is ignored.
   */
  set zz(v: Vec2Like) {
    this.z = Vec2.interpolate(v).x;
  }

  /** The z and w components as a new Vec2. */
  get zw(): Vec2 {
    return new Vec2(this.z, this.w);
  }
  /** Set z and w from a Vec2 or array, in that order. */
  set zw(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.w = v.y;
  }

  /** The w and x components as a new Vec2. */
  get wx(): Vec2 {
    return new Vec2(this.w, this.x);
  }
  /** Set w and x from a Vec2 or array, in that order. */
  set wx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.x = v.y;
  }

  /** The w and y components as a new Vec2. */
  get wy(): Vec2 {
    return new Vec2(this.w, this.y);
  }
  /** Set w and y from a Vec2 or array, in that order. */
  set wy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.y = v.y;
  }

  /** The w and z components as a new Vec2. */
  get wz(): Vec2 {
    return new Vec2(this.w, this.z);
  }
  /** Set w and z from a Vec2 or array, in that order. */
  set wz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.z = v.y;
  }

  /** The w component twice, as a new Vec2. */
  get ww(): Vec2 {
    return new Vec2(this.w, this.w);
  }
  /**
   * Set w from the first component of a Vec2 or array. The second component
   * is ignored.
   */
  set ww(v: Vec2Like) {
    this.w = Vec2.interpolate(v).x;
  }

  // Static methods

  /**
   * Convert a loosely typed value into a new Vec4.
   *
   * - A number is used for all four components.
   * - A string is read as comma-separated `"x, y, z, w"`.
   * - An array is read as `[x, y, z, w]`.
   * - Any other object is read from its x, y, z and w properties.
   *
   * Throws an `Error` for `NaN`, or for a string with fewer than four numeric
   * values.
   *
   * @param v The value to convert.
   * @returns A new Vec4.
   */
  static interpolate(v: Vec4Like | number | string): Vec4 {
    if (typeof v === "number") {
      if (isNaN(v)) throw new Error("The passed interpolant could not be parsed into a Vec4");
      return new Vec4(v, v, v, v);
    } else if (typeof v === "string") {
      const nv = v.split(",");
      const x: number = Number(nv[0]);
      const y: number = Number(nv[1]);
      const z: number = Number(nv[2]);
      const w: number = Number(nv[3]);
      if (nv.length >= 4 && !isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(w)) {
        return new Vec4(x, y, z, w);
      } else {
        throw new Error("The passed interpolant could not be parsed into a Vec4");
      }
    } else if (Array.isArray(v)) {
      return new Vec4(v[0], v[1], v[2], v[3]);
    } else {
      return new Vec4(v.x, v.y, v.z, v.w);
    }
  }

  /**
   * Linearly interpolate between two vectors. `d` is not clamped, so values
   * outside 0–1 extrapolate.
   *
   * @param v1 The start vector, returned when `d` is 0.
   * @param v2 The end vector, returned when `d` is 1.
   * @param d The interpolation amount, usually from 0 to 1.
   * @returns A new Vec4 (also when called as `Quat.lerp`).
   */
  static lerp(v1: Vec4, v2: Vec4, d: number) {
    return new Vec4(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y),
      v1.z + d * (v2.z - v1.z),
      v1.w + d * (v2.w - v1.w)
    );
  }

  /**
   * The angle between two vectors, in radians, from 0 to π, whatever their
   * lengths. If either vector has zero length the result is π / 2. For the
   * rotation between two quaternions, use `Quat.getAngle`.
   *
   * @param a The first vector.
   * @param b The second vector.
   * @returns The angle in radians.
   */
  static getAngle(a: V4Q, b: V4Q): number {
    const lengths = a.length * b.length;
    if (lengths === 0) return Math.PI / 2;
    const cosine = a.dot(b) / lengths;
    return Math.acos(Math.min(1, Math.max(-1, cosine)));
  }

  /** Iterate over the components, so the vector can be spread or destructured: `const [x, y, z, w] = v`. */
  [Symbol.iterator](): Iterator<number> {
    return this.array[Symbol.iterator]();
  }
}

export { Vec4, V4Q };
