import { Vec2 } from "./Vec2";
import { Mat4 } from "./Mat4";

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
    let [x, y, z, w] = args;
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

    // Translate to the origin
    const translated = this.subtractNew(origin);

    // Rotate
    const rotated = translated.clone();
    rotated.y = rotated.y * c - rotated.z * s;
    rotated.z = rotated.y * s + rotated.z * c;

    // Translate back
    this.y = rotated.y + origin.y;
    this.z = rotated.z + origin.z;

    return this;
  }

  rotateXNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateX(origin, radian);
  }

  rotateY(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    // Translate to the origin
    const translated = this.subtractNew(origin);

    // Rotate
    const rotated = translated.clone();
    rotated.x = rotated.z * s + rotated.z * c;
    rotated.z = rotated.z * c - rotated.x * s;

    // Translate back
    this.x = rotated.x + origin.x;
    this.z = rotated.z + origin.z;

    return this;
  }

  rotateyNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateY(origin, radian);
  }

  rotateZ(origin: Vec3, radian: number): Vec3 {
    const s = Math.sin(radian);
    const c = Math.cos(radian);

    // Translate to the origin
    const translated = this.subtractNew(origin);

    // Rotate
    const rotated = translated.clone();
    rotated.x = rotated.x * c - rotated.y * s;
    rotated.y = rotated.x * s + rotated.y * c;

    // Translate back
    this.x = rotated.x + origin.x;
    this.y = rotated.y + origin.y;

    return this;
  }

  rotateZNew(origin: Vec3, radian: number): Vec3 {
    return this.clone().rotateZ(origin, radian);
  }

  transformByMat4(m: any): Vec3 {
    if (m.array) m = m.array; // This just transforms the matrix to an array.
    if (m instanceof Array && m.length >= 16) {
      const o = this.clone();
      const w = m[3] * o.x + m[7] * o.y + m[11] * o.z + m[15] || 1;
      this.x = (m[0] * o.x + m[4] * o.y + m[8] * o.z + m[12]) / w;
      this.y = (m[1] * o.x + m[5] * o.y + m[9] * o.z + m[13]) / w;
      this.z = (m[2] * o.x + m[6] * o.y + m[10] * o.z + m[14]) / w;
    }
    return this;
  }

  transformByMat4New(m: any): Vec3 {
    return this.clone().transformByMat4(m);
  }

  transformByMat3(m: any): Vec3 {
    if (m.array) m = m.array; // This just transforms the matrix to an array.
    if (m instanceof Array && m.length >= 9) {
      const o = this.clone();
      this.x = m[0] * o.x + m[3] * o.y + m[6] * o.z;
      this.y = m[1] * o.x + m[4] * o.y + m[7] * o.z;
      this.z = m[2] * o.x + m[5] * o.y + m[8] * o.z;
    }
    return this;
  }

  transformByMat3New(m: any): Vec3 {
    return this.clone().transformByMat3(m);
  }

  transformByQuat(q: any): Vec3 {
    if (q.array) q = q.array; // This just transforms the quaternion to an array.
    if (q instanceof Array && q.length >= 4) {
      const o = this.clone();
      const uv = new Vec3(
        q[1] * o.z - q[2] * o.y,
        q[2] * o.x - q[0] * o.z,
        q[0] * o.y - q[1] * o.x
      );
      const uuv = new Vec3(
        q[1] * uv.z - q[2] * uv.y,
        q[2] * uv.x - q[0] * uv.z,
        q[0] * uv.y - q[1] * uv.x
      );
      uv.scale(2 * q[3]);
      uuv.scale(2 * q[3]);

      this.add(uv);
      this.add(uuv);
    }
    return this;
  }

  transformByQuatNew(q: any): Vec3 {
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
      this.x * vector.y - this.y * vector.x
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
      throw new TypeError("Y should be a number");
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
  get xyz(): any {
    return new Vec3(this.x, this.y, this.z);
  }
  set xyz(v: any) {
    if (v instanceof Vec3) {
      this.resetToVector(v);
    } else if (v instanceof Array && v.length >= 3) {
      this.reset(v[0], v[1], v[2]);
    } else {
      throw new Error("input should be of type Vector");
    }
  }

  /**
   * (getter/sette) Swizzle YZX
   *
   * @type {Vec3}
   */
  get yzx(): any {
    return new Vec3(this.y, this.z, this.x);
  }
  set yzx(v: any) {
    this.xyz = Vec3.interpolate(v).yzx;
  }

  /**
   * (getter/sette) Swizzle ZXY
   *
   * @type {Vec3}
   */
  get zxy(): any {
    return new Vec3(this.z, this.x, this.y);
  }
  set zxy(v: any) {
    this.xyz = Vec3.interpolate(v).zxy;
  }

  /**
   * (getter/sette) Swizzle XY
   *
   * @type {Vec2}
   */
  get xy(): any {
    return new Vec2(this.x, this.y);
  }
  set xy(v: any) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.y = v.y;
  }

  /**
   * (getter/sette) Swizzle YZ
   *
   * @type {Vec2}
   */
  get yz(): any {
    return new Vec2(this.y, this.z);
  }
  set yz(v: any) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.z = v.y;
  }

  /**
   * (getter/sette) Swizzle zx
   *
   * @type {Vec2}
   */
  get zx(): any {
    return new Vec2(this.z, this.x);
  }
  set zx(v: any) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.x = v.y;
  }

  /**
   * (getter/sette) Swizzle YX
   *
   * @type {number}
   */
  get yx(): any {
    return new Vec2(this.y, this.x);
  }
  set yx(v: any) {
    v = Vec2.interpolate(v);
    this.x = v.y;
    this.y = v.x;
  }

  /**
   * (getter/sette) Swizzle ZY
   *
   * @type {number}
   */
  get zy(): any {
    return new Vec2(this.z, this.y);
  }
  set zy(v: any) {
    v = Vec2.interpolate(v);
    this.z = v.y;
    this.y = v.x;
  }

  /**
   * (getter/sette) Swizzle XX
   *
   * @type {number}
   */
  get xx(): any {
    return new Vec2(this.x, this.x);
  }
  set xx(v: any) {
    v = Vec2.interpolate(v);
    this.x = v.y;
  }

  /**
   * (getter/sette) Swizzle YY
   *
   * @type {number}
   */
  get yy(): any {
    return new Vec2(this.y, this.y);
  }
  set yy(v: any) {
    v = Vec2.interpolate(v);
    this.y = v.y;
  }

  /**
   * (getter/sette) Swizzle ZZ
   *
   * @type {number}
   */
  get zz(): any {
    return new Vec2(this.z, this.z);
  }
  set zz(v: any) {
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
  static interpolate(v: any) {
    if (!isNaN(v.x) && !isNaN(v.x) && !isNaN(v.z)) {
      return new Vec3(v.x, v.y, v.z);
    } else if (v instanceof Array && v.length >= 3) {
      return new Vec3(v[0], v[1], v[2]);
    } else if (!isNaN(v)) {
      return new Vec3(v, v, v);
    } else if (typeof v === "string") {
      const nv = v.split(",");
      const x: number = Number(nv[0]);
      const y: number = Number(nv[1]);
      const z: number = Number(nv[2]);
      if (nv.length >= 3 && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
        return new Vec3(x, y, z);
      }
    } else {
      throw new Error("The passed interpolant could not be parsed into a Vec3");
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
  static lerp(v1: Vec3, v2: Vec3, d): Vec3 {
    return new Vec3(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y),
      v1.z + d * (v2.z - v1.z)
    );
  }

  static getAngle(a: Vec3, b: Vec3) {
    const _a = a.xy,
      _b = b.xy;

    let len1 = _a.lengthSquared;
    if (len1 > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len1 = 1 / Math.sqrt(len1);
    }

    let len2 = _b.lengthSquared;
    if (len2 > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len2 = 1 / Math.sqrt(len2);
    }

    let cosine = (_a.x * _b.x + _a.y * _b.y) * len1 * len2;

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }

  static fromRotationMatrix(m: any, order: String = "YXZ"): Vec3 | void {
    if (m.array) m = m.array; // This just transforms the matrix to an array.
    if (m instanceof Array && m.length >= 16) {
      const v = new Vec3();
      if (order === "XYZ") {
        v.y = Math.asin(Math.min(Math.max(m[8], -1), 1));
        if (Math.abs(m[8]) < 0.99999) {
          v.x = Math.atan2(-m[9], m[10]);
          v.z = Math.atan2(-m[4], m[0]);
        } else {
          v.x = Math.atan2(m[6], m[5]);
          v.z = 0;
        }
      } else if (order === "YXZ") {
        v.x = Math.asin(-Math.min(Math.max(m[9], -1), 1));
        if (Math.abs(m[9]) < 0.99999) {
          v.y = Math.atan2(m[8], m[10]);
          v.z = Math.atan2(m[1], m[5]);
        } else {
          v.y = Math.atan2(-m[2], m[0]);
          v.z = 0;
        }
      } else if (order === "ZXY") {
        v.x = Math.asin(Math.min(Math.max(m[6], -1), 1));
        if (Math.abs(m[6]) < 0.99999) {
          v.y = Math.atan2(-m[2], m[10]);
          v.z = Math.atan2(-m[4], m[5]);
        } else {
          v.y = 0;
          v.z = Math.atan2(m[1], m[0]);
        }
      } else if (order === "ZYX") {
        v.y = Math.asin(-Math.min(Math.max(m[2], -1), 1));
        if (Math.abs(m[2]) < 0.99999) {
          v.x = Math.atan2(m[6], m[10]);
          v.z = Math.atan2(m[1], m[0]);
        } else {
          v.x = 0;
          v.z = Math.atan2(-m[4], m[5]);
        }
      } else if (order === "YZX") {
        v.z = Math.asin(Math.min(Math.max(m[1], -1), 1));
        if (Math.abs(m[1]) < 0.99999) {
          v.x = Math.atan2(-m[9], m[5]);
          v.y = Math.atan2(-m[2], m[0]);
        } else {
          v.x = 0;
          v.y = Math.atan2(m[8], m[10]);
        }
      } else if (order === "XZY") {
        v.z = Math.asin(-Math.min(Math.max(m[4], -1), 1));
        if (Math.abs(m[4]) < 0.99999) {
          v.x = Math.atan2(m[6], m[5]);
          v.y = Math.atan2(m[8], m[0]);
        } else {
          v.x = Math.atan2(-m[9], m[10]);
          v.y = 0;
        }
      }
      return v;
    }
  }
}

export { Vec3 };
