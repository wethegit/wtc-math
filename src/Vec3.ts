import { Vec2 } from "./Vec2";
import type { Vec2Like, Vec3Like, QuatLike, Mat3Like, Mat4Like } from "./types";

/**
 * A basic 3D Vector class that provides simple algebraic functionality in the form
 * of 3D Vectors.
 *
 * We use Getters/setters for both principle properties (x & y) as well as virtual
 * properties (rotation, length etc.).
 *
 * @class Vec3
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec3 {
  /**
   * The Vector Class constructor
   *
   * @constructor
   * @param {number} x 				The x coord
   * @param {number} y 				The y coord
   * @param {number} z 				The z coord
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Resets the vector coordinates
   *
   * @public
   * @chainable
   * @param {number} x 				The x coord
   * @param {number} y 				The y coord
   * @param {number} z 				The z coord
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
   * Resets the vector coordinates to another vector object
   *
   * @public
   * @chainable
   * @param {Vec3} v 				The vector object to use to reset the coordinates
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
   * Clones the vector
   *
   * @public
   * @return {Vec3}					The cloned vector
   */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Adds one vector to another.
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to add to this one
   * @return {Vec3}					Returns itself, modified
   */
  add(vector: Vec3): Vec3 {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }
  /**
   * Clones the vector and adds the vector to it instead
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to add to this one
   * @return {Vec3}					Returns the clone of itself, modified
   */
  addNew(vector: Vec3): Vec3 {
    return this.clone().add(vector);
  }

  /**
   * Adds a scalar to the vector, modifying both the x and y
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec3}					Returns itself, modified
   */
  addScalar(scalar: number): Vec3 {
    return this.add(new Vec3(scalar, scalar, scalar));
  }
  /**
   * Clones the vector and adds the scalar to it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec3}					Returns the clone of itself, modified
   */
  addScalarNew(scalar: number): Vec3 {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtracts one vector from another.
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to subtract from this one
   * @return {Vec3}					Returns itself, modified
   */
  subtract(vector: Vec3): Vec3 {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }
  /**
   * Clones the vector and subtracts the vector from it instead
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to subtract from this one
   * @return {Vec3}					Returns the clone of itself, modified
   */
  subtractNew(vector: Vec3): Vec3 {
    return this.clone().subtract(vector);
  }

  /**
   * Subtracts a scalar from the vector, modifying both the x and y
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to subtract from the vector
   * @return {Vec3}					Returns itself, modified
   */
  subtractScalar(scalar: number): Vec3 {
    return this.subtract(new Vec3(scalar, scalar, scalar));
  }
  /**
   * Clones the vector and subtracts the scalar from it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec3}					Returns the clone of itself, modified
   */
  subtractScalarNew(scalar: number): Vec3 {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divides one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to divide this by
   * @return {Vec3}					Returns itself, modified
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
   * Clones the vector and divides it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to divide the clone by
   * @return {Vec3}					Returns the clone of itself, modified
   */
  divideNew(vector: Vec3): Vec3 {
    return this.clone().divide(vector);
  }

  /**
   * Divides the vector by a scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec3}					Returns itself, modified
   */
  divideScalar(scalar: number): Vec3 {
    var v = new Vec3(scalar, scalar, scalar);
    return this.divide(v);
  }
  /**
   * Clones the vector and divides it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec3}					Returns the clone of itself, modified
   */
  divideScalarNew(scalar: number): Vec3 {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiplies one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to multiply this by
   * @return {Vec3}					Returns itself, modified
   */
  multiply(vector: Vec3): Vec3 {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
  }
  /**
   * Clones the vector and multiplies it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec3}  vector The vector to multiply the clone by
   * @return {Vec3}					Returns the clone of itself, modified
   */
  multiplyNew(vector: Vec3): Vec3 {
    return this.clone().multiply(vector);
  }

  /**
   * Multiplies the vector by a scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec3}					Returns itself, modified
   */
  multiplyScalar(scalar: number): Vec3 {
    var v = new Vec3(scalar, scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Clones the vector and multiplies it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec3}					Returns the clone of itself, modified
   */
  multiplyScalarNew(scalar: number): Vec3 {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}
   */
  scale(scalar: number): Vec3 {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}
   */
  scaleNew(scalar: number): Vec3 {
    return this.multiplyScalarNew(scalar);
  }

  rotateX(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const ty = translated.y;

    this.y = ty * c - translated.z * s + origin.y;
    this.z = ty * s + translated.z * c + origin.z;

    return this;
  }

  rotateXNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateX(origin, radian);
  }

  rotateY(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const tx = translated.x;

    this.x = tx * c + translated.z * s + origin.x;
    this.z = translated.z * c - tx * s + origin.z;

    return this;
  }

  rotateYNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateY(origin, radian);
  }

  rotateZ(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    const translated = this.subtractNew(origin);
    const tx = translated.x;

    this.x = tx * c - translated.y * s + origin.x;
    this.y = tx * s + translated.y * c + origin.y;

    return this;
  }

  rotateZNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateZ(origin, radian);
  }

  transformByMat4(m: Mat4Like): Vec3 {
    const ma = Array.isArray(m) ? m : m.array;
    const o = this.clone();
    const w = ma[3] * o.x + ma[7] * o.y + ma[11] * o.z + ma[15] || 1;
    this.x = (ma[0] * o.x + ma[4] * o.y + ma[8] * o.z + ma[12]) / w;
    this.y = (ma[1] * o.x + ma[5] * o.y + ma[9] * o.z + ma[13]) / w;
    this.z = (ma[2] * o.x + ma[6] * o.y + ma[10] * o.z + ma[14]) / w;
    return this;
  }

  transformByMat4New(m: Mat4Like): Vec3 {
    return this.clone().transformByMat4(m);
  }

  transformByMat3(m: Mat3Like): Vec3 {
    const ma = Array.isArray(m) ? m : m.array;
    const o = this.clone();
    this.x = ma[0] * o.x + ma[3] * o.y + ma[6] * o.z;
    this.y = ma[1] * o.x + ma[4] * o.y + ma[7] * o.z;
    this.z = ma[2] * o.x + ma[5] * o.y + ma[8] * o.z;
    return this;
  }

  transformByMat3New(m: Mat3Like): Vec3 {
    return this.clone().transformByMat3(m);
  }

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

  transformByQuatNew(q: QuatLike): Vec3 {
    return this.clone().transformByQuat(q);
  }

  /**
   * Negates the vector.
   *
   * @public
   * @chainable
   * @return {Vec3}					Returns itself, modified
   */
  negate(): Vec3 {
    return this.multiplyScalar(-1);
  }

  /**
   * Clones the vector and negates it.
   *
   * @public
   * @chainable
   * @return {Vec3}					Returns itself, modified
   */
  negateNew(): Vec3 {
    return this.multiplyScalarNew(-1);
  }

  /**
   * Inverses the vector.
   *
   * @public
   * @chainable
   * @return {Vec3}					Returns itself, modified
   */
  inverse(): Vec3 {
    this.x = 1 / this.x;
    this.y = 1 / this.y;
    this.z = 1 / this.z;
    return this;
  }

  /**
   * Clones the vector and then inverses it.
   *
   * @public
   * @chainable
   * @return {Vec3}					Returns itself, modified
   */
  inverseNew(): Vec3 {
    const c = this.clone();
    c.x = 1 / c.x;
    c.y = 1 / c.y;
    c.z = 1 / c.z;
    return c;
  }

  /**
   * Normalises the vector down to a length of 1 unit
   *
   * @public
   * @chainable
   * @return {Vec3}					Returns itself, modified
   */
  normalise(): Vec3 {
    return this.divideScalar(this.length);
  }
  /**
   * Clones the vector and normalises it
   *
   * @public
   * @chainable
   * @return {Vec3}					Returns a clone of itself, modified
   */
  normaliseNew(): Vec3 {
    return this.divideScalarNew(this.length);
  }

  /**
   * Calculates the distance between this and the supplied vector
   *
   * @param  {Vec3} vector The vector to calculate the distance from
   * @return {number}        The distance between this and the supplied vector
   */
  distance(vector: Vec3): number {
    return this.subtractNew(vector).length;
  }

  /**
   * Calculates the distance on the X axis between this and the supplied vector
   *
   * @param  {Vec3} vector The vector to calculate the distance from
   * @return {number}        The distance, along the x axis, between this and the supplied vector
   */
  distanceX(vector: Vec3): number {
    return this.x - vector.x;
  }

  /**
   * Calculated the distance on the Y axis between this and the supplied vector
   *
   * @param  {Vec3} vector The vector to calculate the distance from
   * @return {number}        The distance, along the y axis, between this and the supplied vector
   */
  distanceY(vector: Vec3): number {
    return this.y - vector.y;
  }

  /**
   * Calculated the distance on the Z axis between this and the supplied vector
   *
   * @param  {Vec3} vector The vector to calculate the distance from
   * @return {number}        The distance, along the y axis, between this and the supplied vector
   */
  distanceZ(vector: Vec3): number {
    return this.z - vector.z;
  }

  /**
   * Calculates the dot product between this and a supplied vector
   *
   * @example
   * // returns -14
   * new Vector(2, -3).dot(new Vector(-4, 2))
   * new Vector(-4, 2).dot(new Vector(2, -3))
   * new Vector(2, -4).dot(new Vector(-3, 2))
   *
   * @param  {Vec3} vector The vector object against which to calculate the dot product
   * @return {number}        The dot product of the two vectors
   */
  dot(vector: Vec3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  /**
   * Calculates the cross product between this and the supplied vector.
   *
   * @example
   * // returns -2
   * new Vector(2, -3).cross(new Vector(-4, 2))
   * new Vector(-4, 2).cross(new Vector(2, -3))
   * // returns 2
   * new Vector(2, -4).cross(new Vector(-3, 2))
   *
   * @param  {Vec3} vector The vector object against which to calculate the cross product
   * @return {Vec3}        The cross product of the two vectors
   */
  cross(vector: Vec3): Vec3 {
    return new Vec3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x,
    );
  }

  crossNew(vector: Vec3): Vec3 {
    return this.clone().cross(vector);
  }

  ceil(): Vec3 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  ceilNew(): Vec3 {
    return this.clone().ceil();
  }

  floor(): Vec3 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  floorNew(): Vec3 {
    return this.clone().floor();
  }

  round(): Vec3 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  roundNew(): Vec3 {
    return this.clone().round();
  }

  fract(): Vec3 {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    this.z -= Math.floor(this.z);
    return this;
  }

  fractNew(): Vec3 {
    return this.clone().fract();
  }

  /**
   * Getters and setters
   */

  /**
   * (getter/setter) The x value of the vector.
   *
   * @type {number}
   * @default 0
   */
  #x: number = 0;
  set x(x: number) {
    if (typeof x == "number") {
      this.#x = x;
    } else {
      throw new TypeError("X should be a number");
    }
  }
  get x(): number {
    return this.#x || 0;
  }

  /**
   * (getter/setter) The y value of the vector.
   *
   * @type {number}
   * @default 0
   */
  #y: number = 0;
  set y(y: number) {
    if (typeof y == "number") {
      this.#y = y;
    } else {
      throw new TypeError("Y should be a number");
    }
  }
  get y(): number {
    return this.#y || 0;
  }

  /**
   * (getter/setter) The y value of the vector.
   *
   * @type {number}
   * @default 0
   */
  #z: number = 0;
  set z(z: number) {
    if (typeof z == "number") {
      this.#z = z;
    } else {
      throw new TypeError("Z should be a number");
    }
  }
  get z(): number {
    return this.#z || 0;
  }

  /**
   * (getter/setter) The length of the vector presented as a square. If you're using
   * length for comparison, this is quicker.
   *
   * @type {number}
   * @default 0
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
  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * (getter/setter) The length of the vector
   *
   * @type {number}
   * @default 0
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
  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  /**
   * (getter/setter) Spherical radius. For using a vec3 as spherical coordinates.
   * Alias of {@link Vector#x x}
   *
   * @type {number}
   */
  set radius(s: number) {
    this.x = s;
  }
  get radius(): number {
    return this.x;
  }

  /**
   * (getter/setter) Spherical phi. For using a vec3 as spherical coordinates.
   * Alias of {@link Vector#y y}
   *
   * @type {number}
   */
  set phi(p: number) {
    this.y = p;
  }
  get phi(): number {
    return this.y;
  }

  /**
   * (getter/setter) Spherical theta. For using a vec3 as spherical coordinates.
   * Alias of {@link Vector#z z}
   *
   * @type {number}
   */
  set theta(t: number) {
    this.z = t;
  }
  get theta(): number {
    return this.z;
  }

  /**
   * (getter/setter) Vector width.
   * Alias of {@link Vector#x x}
   *
   * @type {number}
   */
  set width(w: number) {
    this.x = w;
  }
  get width(): number {
    return this.x;
  }

  /**
   * (getter/setter) Vector height.
   * Alias of {@link Vector#x x}
   *
   * @type {number}
   */
  set height(h: number) {
    this.y = h;
  }
  get height(): number {
    return this.y;
  }

  /**
   * (getter/setter) Vector height.
   * Alias of {@link Vector#x x}
   *
   * @type {number}
   */
  set depth(h: number) {
    this.z = h;
  }
  get depth(): number {
    return this.z;
  }

  /**
   * (getter) Vector area.
   * @readonly
   *
   * @type {number}
   */
  get area(): number {
    return this.x * this.y * this.z;
  }

  /**
   * (getter) Returns the basic array representation of this vector.
   * @readonly
   *
   * @type {number}
   */
  get array(): number[] {
    return [this.x, this.y, this.z];
  }

  /**
   * (getter/sette) Swizzle XYZ
   *
   * @type {Vec3}
   */
  get xyz(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }
  set xyz(v: Vec3Like) {
    if (Array.isArray(v)) {
      this.reset(v[0], v[1], v[2]);
    } else {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    }
  }

  /**
   * (getter/sette) Swizzle YZX
   *
   * @type {Vec3}
   */
  get yzx(): Vec3 {
    return new Vec3(this.y, this.z, this.x);
  }
  set yzx(v: Vec3Like) {
    this.xyz = Vec3.interpolate(v).yzx;
  }

  /**
   * (getter/sette) Swizzle ZXY
   *
   * @type {Vec3}
   */
  get zxy(): Vec3 {
    return new Vec3(this.z, this.x, this.y);
  }
  set zxy(v: Vec3Like) {
    this.xyz = Vec3.interpolate(v).zxy;
  }

  /**
   * (getter/sette) Swizzle XY
   *
   * @type {Vec2}
   */
  get xy(): Vec2 {
    return new Vec2(this.x, this.y);
  }
  set xy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.y = v.y;
  }

  /**
   * (getter/sette) Swizzle YZ
   *
   * @type {Vec2}
   */
  get yz(): Vec2 {
    return new Vec2(this.y, this.z);
  }
  set yz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.z = v.y;
  }

  /**
   * (getter/sette) Swizzle zx
   *
   * @type {Vec2}
   */
  get zx(): Vec2 {
    return new Vec2(this.z, this.x);
  }
  set zx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.x = v.y;
  }

  /**
   * (getter/sette) Swizzle YX
   *
   * @type {number}
   */
  get yx(): Vec2 {
    return new Vec2(this.y, this.x);
  }
  set yx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.y;
    this.y = v.x;
  }

  /**
   * (getter/sette) Swizzle ZY
   *
   * @type {number}
   */
  get zy(): Vec2 {
    return new Vec2(this.z, this.y);
  }
  set zy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.y;
    this.y = v.x;
  }

  /**
   * (getter/sette) Swizzle XX
   *
   * @type {number}
   */
  get xx(): Vec2 {
    return new Vec2(this.x, this.x);
  }
  set xx(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.x = v.y;
  }

  /**
   * (getter/sette) Swizzle YY
   *
   * @type {number}
   */
  get yy(): Vec2 {
    return new Vec2(this.y, this.y);
  }
  set yy(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.y = v.y;
  }

  /**
   * (getter/sette) Swizzle ZZ
   *
   * @type {number}
   */
  get zz(): Vec2 {
    return new Vec2(this.z, this.z);
  }
  set zz(v: Vec2Like) {
    v = Vec2.interpolate(v);
    this.z = v.y;
  }

  /**
   * Static methods
   */
  /**
   * Iterpolates a provided anonymous value into a vew Vec3
   *
   * @param {Vec3|array|string|number} v The value to interpolate
   * @returns {Vec3} out
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
   * Performs a linear interpolation between two Vec3's
   *
   * @param {Vec3} v1 the first operand
   * @param {Vec3} v2 the second operand
   * @param {Number} d interpolation amount in the range of 0 - 1
   * @returns {Vec3}
   */
  static lerp(v1: Vec3, v2: Vec3, d: number): Vec3 {
    return new Vec3(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y),
      v1.z + d * (v2.z - v1.z),
    );
  }

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

  /**
   * Adds iteration to the object, allowing it
   * to be destructured and iterated upon in
   * various useful ways.
   */
  [Symbol.iterator]() {
    let values = this.array;
    let index = 0;
    return {
      next() {
        if (index < values.length) {
          let value = values[index];
          index++;
          return { value, done: false };
        } else return { done: true };
      },
    };
  }
}

export { Vec3 };
