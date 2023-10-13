import { Vec2 } from "./Vec2";
import { Vec3 } from "./Vec3";

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
  xyzw: any;
  yzwx: any;
  zwxy: any;
  wxyz: any;
  xyz: any;
  yzx: any;
  zxy: any;
  xx: any;
  xy: any;
  xz: any;
  xw: any;
  yx: any;
  yy: any;
  yz: any;
  yw: any;
  zx: any;
  zy: any;
  zz: any;
  zw: any;
  wx: any;
  wy: any;
  wz: any;
  ww: any;
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
  transformByMat4(m: any): V4Q;
  transformByMat4New(m: any): V4Q;
  transformByQuat(q: any): V4Q;
  transformByQuatNew(q: any): V4Q;
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
 * A basic 3D Vector class that provides simple algebraic functionality in the form
 * of 3D Vectors.
 *
 * We use Getters/setters for both principle properties (x & y) as well as virtual
 * properties (rotation, length etc.).
 *
 * @class Vec4
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec4 implements V4Q {
  /**
   * The Vector Class constructor
   *
   * @constructor
   * @param {number} x 				The x coord
   * @param {number} y 				The y coord
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Resets the vector coordinates
   *
   * @public
   * @chainable
   * @param {number} x 	The x coord
   * @param {number} y 	The y coord
   * @param {number} z 	The z coord
   * @param {number} w 	The w coord
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
   * Resets the vector coordinates to another vector object
   *
   * @public
   * @chainable
   * @param {Vec4} v 				The vector object to use to reset the coordinates
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
   * Clones the vector
   *
   * @public
   * @return {Vec4}					The cloned vector
   */
  clone(): V4Q {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /**
   * Adds one vector to another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to add to this one
   * @return {Vec4}					Returns itself, modified
   */
  add(vector: V4Q): V4Q {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }
  /**
   * Clones the vector and adds the vector to it instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to add to this one
   * @return {Vec4}					Returns the clone of itself, modified
   */
  addNew(vector: V4Q): V4Q {
    return this.clone().add(vector);
  }

  /**
   * Adds a scalar to the vector, modifying both the x and y
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec4}					Returns itself, modified
   */
  addScalar(scalar: number): V4Q {
    return this.add(new Vec4(scalar, scalar, scalar, scalar));
  }
  /**
   * Clones the vector and adds the scalar to it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec4}					Returns the clone of itself, modified
   */
  addScalarNew(scalar: number): V4Q {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtracts one vector from another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to subtract from this one
   * @return {Vec4}					Returns itself, modified
   */
  subtract(vector: V4Q): V4Q {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    this.w -= vector.w;
    return this;
  }
  /**
   * Clones the vector and subtracts the vector from it instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to subtract from this one
   * @return {Vec4}					Returns the clone of itself, modified
   */
  subtractNew(vector: V4Q): V4Q {
    return this.clone().subtract(vector);
  }

  /**
   * Subtracts a scalar from the vector, modifying both the x and y
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to subtract from the vector
   * @return {Vec4}					Returns itself, modified
   */
  subtractScalar(scalar: number): V4Q {
    return this.subtract(new Vec4(scalar, scalar, scalar, scalar));
  }
  /**
   * Clones the vector and subtracts the scalar from it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec4}					Returns the clone of itself, modified
   */
  subtractScalarNew(scalar: number): V4Q {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divides one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to divide this by
   * @return {Vec4}					Returns itself, modified
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
   * Clones the vector and divides it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to divide the clone by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  divideNew(vector: V4Q): V4Q {
    return this.clone().divide(vector);
  }

  /**
   * Divides the vector by a scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec4}					Returns itself, modified
   */
  divideScalar(scalar: number): V4Q {
    var v = new Vec4(scalar, scalar, scalar, scalar);
    return this.divide(v);
  }
  /**
   * Clones the vector and divides it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  divideScalarNew(scalar: number): V4Q {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiplies one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to multiply this by
   * @return {Vec4}					Returns itself, modified
   */
  multiply(vector: V4Q): V4Q {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }
  /**
   * Clones the vector and multiplies it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to multiply the clone by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  multiplyNew(q: V4Q): V4Q {
    return this.clone().multiply(q);
  }

  /**
   * Multiplies the vector by a scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec4}					Returns itself, modified
   */
  multiplyScalar(scalar: number): V4Q {
    var v: Vec4 = new Vec4(scalar, scalar, scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Clones the vector and multiplies it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  multiplyScalarNew(scalar: number): V4Q {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}
   */
  scale(scalar: number): V4Q {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}
   */
  scaleNew(scalar: number): V4Q {
    return this.multiplyScalarNew(scalar);
  }

  rotateX(origin: V4Q, radian: number): V4Q {
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

  rotateXNew(origin: V4Q, radian: number): V4Q {
    return this.clone().rotateX(origin, radian);
  }

  rotateY(origin: V4Q, radian: number): V4Q {
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

  rotateYNew(origin: V4Q, radian: number): V4Q {
    return this.clone().rotateY(origin, radian);
  }

  rotateZ(origin: V4Q, radian: number): V4Q {
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

  rotateZNew(origin: V4Q, radian: number): V4Q {
    return this.clone().rotateZ(origin, radian);
  }

  transformByMat4(m: any): V4Q {
    if (m.array) m = m.array; // This just transforms the matrix to an array.
    if (m instanceof Array && m.length >= 16) {
      const o = this.clone();
      this.x = (m[0] * o.x + m[4] * o.y + m[8] * o.z + m[12]) / this.w;
      this.y = (m[1] * o.x + m[5] * o.y + m[9] * o.z + m[13]) / this.w;
      this.z = (m[2] * o.x + m[6] * o.y + m[10] * o.z + m[14]) / this.w;
      this.w = (m[3] * o.x + m[7] * o.y + m[11] * o.z + m[15]) / this.w;
    }
    return this;
  }

  transformByMat4New(m: any): V4Q {
    return this.clone().transformByMat4(m);
  }

  transformByQuat(q: any): V4Q {
    if (q.array) q = q.array; // This just transforms the quaternion to an array.
    if (q instanceof Array && q.length >= 4) {
      const uv = new Vec4(
        q[3] * this.x + q[1] * this.z - q[2] * this.y,
        q[3] * this.y + q[2] * this.x - q[0] * this.z,
        q[3] * this.z + q[0] * this.y - q[1] * this.x,
        -q[0] * this.x - q[1] * this.y - q[2] * this.z
      );

      this.x = uv.x * q[3] + uv.w * -q[0] + uv.y * -q[2] - uv.z * -q[1];
      this.y = uv.y * q[3] + uv.w * -q[1] + uv.z * -q[0] - uv.x * -q[2];
      this.z = uv.z * q[3] + uv.w * -q[2] + uv.x * -q[1] - uv.y * -q[0];
    }
    return this;
  }

  transformByQuatNew(q: any): V4Q {
    return this.clone().transformByQuat(q);
  }

  /**
   * Negates the vector.
   *
   * @public
   * @chainable
   * @return {Vec4}					Returns itself, modified
   */
  negate(): V4Q {
    return this.multiplyScalar(-1);
  }

  /**
   * Clones the vector and negates it.
   *
   * @public
   * @chainable
   * @return {Vec4}					Returns itself, modified
   */
  negateNew(): V4Q {
    return this.multiplyScalarNew(-1);
  }

  /**
   * Inverses the vector.
   *
   * @public
   * @chainable
   * @return {Vec4}					Returns itself, modified
   */
  inverse(): V4Q {
    this.x = 1 / this.x;
    this.y = 1 / this.y;
    this.z = 1 / this.z;
    this.w = 1 / this.w;
    return this;
  }

  /**
   * Clones the vector and then inverses it.
   *
   * @public
   * @chainable
   * @return {Vec4}					Returns itself, modified
   */
  inverseNew(): V4Q {
    const c: V4Q = this.clone();
    c.x = 1 / c.x;
    c.y = 1 / c.y;
    c.z = 1 / c.z;
    c.w = 1 / c.w;
    return c;
  }

  /**
   * Normalises the vector down to a length of 1 unit
   *
   * @public
   * @chainable
   * @return {Vec4}					Returns itself, modified
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
   * Clones the vector and normalises it
   *
   * @public
   * @chainable
   * @return {Vec4}					Returns a clone of itself, modified
   */
  normaliseNew(): V4Q {
    return this.clone().normalise();
  }

  /**
   * Calculates the distance between this and the supplied vector
   *
   * @param  {Vec4} vector The vector to calculate the distance from
   * @return {number}        The distance between this and the supplied vector
   */
  distance(vector: V4Q): number {
    return this.subtractNew(vector).length;
  }

  /**
   * Calculates the distance on the X axis between this and the supplied vector
   *
   * @param  {Vec4} vector The vector to calculate the distance from
   * @return {number}        The distance, along the x axis, between this and the supplied vector
   */
  distanceX(vector: V4Q): number {
    return this.x - vector.x;
  }

  /**
   * Calculated the distance on the Y axis between this and the supplied vector
   *
   * @param  {Vec4} vector The vector to calculate the distance from
   * @return {number}        The distance, along the y axis, between this and the supplied vector
   */
  distanceY(vector: V4Q): number {
    return this.y - vector.y;
  }

  /**
   * Calculated the distance on the Z axis between this and the supplied vector
   *
   * @param  {Vec4} vector The vector to calculate the distance from
   * @return {number}        The distance, along the y axis, between this and the supplied vector
   */
  distanceZ(vector: V4Q): number {
    return this.z - vector.z;
  }

  /**
   * Calculated the distance on the W axis between this and the supplied vector
   *
   * @param  {Vec4} vector The vector to calculate the distance from
   * @return {number}        The distance, along the y axis, between this and the supplied vector
   */
  distanceW(vector: V4Q): number {
    return this.w - vector.w;
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
   * @param  {Vec4} vector The vector object against which to calculate the dot product
   * @return {number}        The dot product of the two vectors
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
   * Calculates the cross product between this and two other supplied vectors
   *
   * @example
   * // returns -2
   * new Vector(2, -3).cross(new Vector(-4, 2))
   * new Vector(-4, 2).cross(new Vector(2, -3))
   * // returns 2
   * new Vector(2, -4).cross(new Vector(-3, 2))
   *
   * @param  {Vec4} vector The vector object against which to calculate the cross product
   * @return {Vec4}        The cross product of the two vectors
   */
  cross(v: V4Q, w: V4Q): V4Q {
    const u = this.clone();

    const A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2],
      G = u[0],
      H = u[1],
      I = u[2],
      J = u[3];

    return new Vec4(
      H * F - I * E + J * D,
      -(G * F) + I * C - J * B,
      G * E - H * C + J * A,
      -(G * D) + H * B - I * A
    );
  }

  crossNew(v: V4Q, w: V4Q): V4Q {
    return this.clone().cross(v, w);
  }

  ceil(): V4Q {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }

  ceilNew(): V4Q {
    return this.clone().ceil();
  }

  floor(): V4Q {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }

  floorNew(): V4Q {
    return this.clone().floor();
  }

  round(): V4Q {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }

  roundNew(): V4Q {
    return this.clone().round();
  }

  fract(): V4Q {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    this.z -= Math.floor(this.z);
    this.w -= Math.floor(this.w);
    return this;
  }

  fractNew(): V4Q {
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
  private _x: number = 0;
  set x(x) {
    if (typeof x == "number") {
      this._x = x;
    } else {
      throw new TypeError("X should be a number");
    }
  }
  get x() {
    return this._x || 0;
  }

  /**
   * (getter/setter) The y value of the vector.
   *
   * @type {number}
   * @default 0
   */
  private _y: number = 0;
  set y(y) {
    if (typeof y == "number") {
      this._y = y;
    } else {
      throw new TypeError("Y should be a number");
    }
  }
  get y() {
    return this._y || 0;
  }

  /**
   * (getter/setter) The y value of the vector.
   *
   * @type {number}
   * @default 0
   */
  private _z: number = 0;
  set z(z) {
    if (typeof z == "number") {
      this._z = z;
    } else {
      throw new TypeError("Y should be a number");
    }
  }
  get z() {
    return this._z || 0;
  }

  /**
   * (getter/setter) The y value of the vector.
   *
   * @type {number}
   * @default 0
   */
  private _w: number = 0;
  set w(w) {
    if (typeof w == "number") {
      this._w = w;
    } else {
      throw new TypeError("W should be a number");
    }
  }
  get w() {
    return this._w || 0;
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
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
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
    return this.x * this.y * this.z * this.w;
  }

  /**
   * (getter) Returns the basic array representation of this vector.
   * @readonly
   *
   * @type {number}
   */
  get array(): number[] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * (getter/sette) Swizzle XYZW
   *
   * @type {Vec4}
   */
  get xyzw(): any {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
  set xyzw(v: any) {
    if (v instanceof Vec4) {
      this.resetToVector(v);
    } else if (v instanceof Array && v.length >= 4) {
      this.reset(v[0], v[1], v[2], v[3]);
    } else {
      throw new Error("input should be of type Vector");
    }
  }

  /**
   * (getter/sette) Swizzle XYZW
   *
   * @type {Vec4}
   */
  get yzwx(): any {
    return new Vec4(this.y, this.z, this.w, this.x);
  }
  set yzwx(v: any) {
    this.xyzw = Vec4.interpolate(v).yzwx;
  }

  /**
   * (getter/sette) Swizzle XYZW
   *
   * @type {Vec4}
   */
  get zwxy(): any {
    return new Vec4(this.z, this.w, this.x, this.y);
  }
  set zwxy(v: any) {
    this.xyzw = Vec4.interpolate(v).zwxy;
  }

  /**
   * (getter/sette) Swizzle XYZW
   *
   * @type {Vec4}
   */
  get wxyz(): any {
    return new Vec4(this.w, this.x, this.y, this.z);
  }
  set wxyz(v: any) {
    this.xyzw = Vec4.interpolate(v).wxyz;
  }

  // I'm skipping all the silly combinations of 4 here because they're largely useless

  /**
   * (getter/sette) Swizzle YZX
   *
   * @type {Vec3}
   */
  get xyz(): any {
    return new Vec3(this.x, this.y, this.z);
  }
  set xyz(v: any) {
    v = Vec3.interpolate(v);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
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
    v = Vec3.interpolate(v);
    this.x = v.y;
    this.y = v.z;
    this.z = v.x;
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
    v = Vec3.interpolate(v);
    this.x = v.z;
    this.y = v.x;
    this.z = v.y;
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
   * (getter/sette) Swizzle XY
   *
   * @type {Vec2}
   */
  get xz(): any {
    return new Vec2(this.x, this.z);
  }
  set xz(v: any) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.z = v.y;
  }

  /**
   * (getter/sette) Swizzle XY
   *
   * @type {Vec2}
   */
  get xw(): any {
    return new Vec2(this.x, this.w);
  }
  set xw(v: any) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.z = v.y;
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
   * (getter/sette) Swizzle YZ
   *
   * @type {Vec2}
   */
  get yw(): any {
    return new Vec2(this.y, this.w);
  }
  set yw(v: any) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.w = v.y;
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
   * (getter/sette) Swizzle XY
   *
   * @type {Vec2}
   */
  get zw(): any {
    return new Vec2(this.z, this.w);
  }
  set zw(v: any) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.w = v.y;
  }

  /**
   * (getter/sette) Swizzle wx
   *
   * @type {Vec2}
   */
  get wx(): any {
    return new Vec2(this.w, this.x);
  }
  set wx(v: any) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.x = v.y;
  }

  /**
   * (getter/sette) Swizzle WY
   *
   * @type {number}
   */
  get wy(): any {
    return new Vec2(this.w, this.y);
  }
  set wy(v: any) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.y = v.y;
  }

  /**
   * (getter/sette) Swizzle WZ
   *
   * @type {number}
   */
  get wz(): any {
    return new Vec2(this.w, this.z);
  }
  set wz(v: any) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.z = v.y;
  }

  /**
   * (getter/sette) Swizzle WW
   *
   * @type {Vec2}
   */
  get ww(): any {
    return new Vec2(this.w, this.w);
  }
  set ww(v: any) {
    v = Vec2.interpolate(v);
    this.w = v.y;
  }

  /**
   * Static methods
   */

  /**
   * Iterpolates a provided anonymous value into a vew Vec4
   *
   * @param {Vec4|array|string|number} v The value to interpolate
   * @returns {Vec4} out
   */
  static interpolate(v) {
    if (!isNaN(v.x) && !isNaN(v.x) && !isNaN(v.z) && !isNaN(v.w)) {
      return new Vec4(v.x, v.y, v.z, v.w);
    } else if (v instanceof Array && v.length >= 4) {
      return new Vec4(v[0], v[1], v[2], v[3]);
    } else if (!isNaN(v)) {
      return new Vec4(v, v, v, v);
    } else if (typeof v === "string") {
      const nv = v.split(",");
      const x: number = Number(nv[0]);
      const y: number = Number(nv[1]);
      const z: number = Number(nv[2]);
      const w: number = Number(nv[3]);
      if (nv.length >= 3 && !isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(w)) {
        return new Vec4(x, y, z, w);
      }
    } else {
      throw new Error("The passed interpolant could not be parsed into a Vec4");
    }
  }

  /**
   * Performs a linear interpolation between two Vec4's
   *
   * @param {Vec4} v1 the first operand
   * @param {Vec4} v2 the second operand
   * @param {Number} d interpolation amount in the range of 0 - 1
   * @returns {Vec4}
   */
  static lerp(v1, v2, d) {
    return new Vec4(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y),
      v1.z + d * (v2.z - v1.z),
      v1.w + d * (v2.w - v1.w)
    );
  }

  static getAngle(a, b) {
    let dotproduct = a.dot(b);

    return Math.acos(2 * dotproduct * dotproduct - 1);
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
        } else return { done: true }
      }
    }
  }
}

export { Vec4, V4Q };
