"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Vec = _interopRequireDefault(require("./Vec2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var conversionFactor = 180 / Math.PI;

var radianToDegrees = function radianToDegrees(radian) {
  return radian * conversionFactor;
};

var degreesToRadian = function degreesToRadian(degrees) {
  return degrees / conversionFactor;
};
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


var Vec3 =
/*#__PURE__*/
function () {
  /**
   * The Vector Class constructor
   *
   * @constructor
   * @param {number} x 				The x coord
   * @param {number} y 				The y coord
   */
  function Vec3(x, y, z) {
    _classCallCheck(this, Vec3);

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(z)) z = 0;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Resets the vector coordinates
   *
   * @public
  * @param {number|Array} x 	The x coord, OR the array to reset to
  * @param {number} y 				The y coord
   */


  _createClass(Vec3, [{
    key: "reset",
    value: function reset(x, y, z) {
      if (x instanceof Array && x.length >= 3) {
        this.x = x[0];
        this.y = x[1];
        this.z = x[2];
      } else {
        this.x = x;
        this.y = y;
        this.z = z;
      }
    }
    /**
     * Resets the vector coordinates to another vector object
     *
     * @public
    * @param {Vector} v 				The vector object to use to reset the coordinates
     */

  }, {
    key: "resetToVector",
    value: function resetToVector(v) {
      if (v instanceof Vec3) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
      }
    }
    /**
     * Clones the vector
     *
     * @public
     * @return {Vec3}					The cloned vector
     */

  }, {
    key: "clone",
    value: function clone() {
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

  }, {
    key: "add",
    value: function add(vector) {
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

  }, {
    key: "addNew",
    value: function addNew(vector) {
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

  }, {
    key: "addScalar",
    value: function addScalar(scalar) {
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

  }, {
    key: "addScalarNew",
    value: function addScalarNew(scalar) {
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

  }, {
    key: "subtract",
    value: function subtract(vector) {
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

  }, {
    key: "subtractNew",
    value: function subtractNew(vector) {
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

  }, {
    key: "subtractScalar",
    value: function subtractScalar(scalar) {
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

  }, {
    key: "subtractScalarNew",
    value: function subtractScalarNew(scalar) {
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

  }, {
    key: "divide",
    value: function divide(vector) {
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

  }, {
    key: "divideNew",
    value: function divideNew(vector) {
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

  }, {
    key: "divideScalar",
    value: function divideScalar(scalar) {
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

  }, {
    key: "divideScalarNew",
    value: function divideScalarNew(scalar) {
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

  }, {
    key: "multiply",
    value: function multiply(vector) {
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

  }, {
    key: "multiplyNew",
    value: function multiplyNew(vector) {
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

  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(scalar) {
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

  }, {
    key: "multiplyScalarNew",
    value: function multiplyScalarNew(scalar) {
      return this.clone().multiplyScalar(scalar);
    }
    /**
     * Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}
     */

  }, {
    key: "scale",
    value: function scale(scalar) {
      return this.multiplyScalar(scalar);
    }
    /**
     * Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}
     */

  }, {
    key: "scaleNew",
    value: function scaleNew(scalar) {
      return this.multiplyScalarNew(scalar);
    }
  }, {
    key: "rotateX",
    value: function rotateX(origin, radian) {
      var s = Math.sin(radian);
      var c = Math.cos(radian); // Translate to the origin

      var translated = this.subtractNew(origin); // Rotate

      var rotated = translated.clone();
      rotated.y = rotated.y * c - rotated.z * s;
      rotated.z = rotated.y * s + rotated.z * c; // Translate back

      this.y = rotated.y + origin.y;
      this.z = rotated.z + origin.z;
      return this;
    }
  }, {
    key: "rotateXNew",
    value: function rotateXNew(radian) {
      return this.clone().rotateX(radian);
    }
  }, {
    key: "rotateY",
    value: function rotateY(origin, radian) {
      var s = Math.sin(radian);
      var c = Math.cos(radian); // Translate to the origin

      var translated = this.subtractNew(origin); // Rotate

      var rotated = translated.clone();
      rotated.x = rotated.z * s + rotated.z * c;
      rotated.z = rotated.z * c - rotated.x * s; // Translate back

      this.x = rotated.x + origin.x;
      this.z = rotated.z + origin.z;
      return this;
    }
  }, {
    key: "rotateyNew",
    value: function rotateyNew(radian) {
      return this.clone().rotateY(radian);
    }
  }, {
    key: "rotateZ",
    value: function rotateZ(origin, radian) {
      var s = Math.sin(radian);
      var c = Math.cos(radian); // Translate to the origin

      var translated = this.subtractNew(origin); // Rotate

      var rotated = translated.clone();
      rotated.x = rotated.x * c - rotated.y * s;
      rotated.y = rotated.x * s + rotated.y * c; // Translate back

      this.x = rotated.x + origin.x;
      this.y = rotated.y + origin.y;
      return this;
    }
  }, {
    key: "rotateZNew",
    value: function rotateZNew(radian) {
      return this.clone().rotateZ(radian);
    }
  }, {
    key: "transformByMat4",
    value: function transformByMat4(m) {
      if (m.array) m = m.array; // This just transforms the matrix to an array.

      if (m instanceof Array && m.length >= 16) {
        var _o = this.clone();

        var w = m[3] * _o.x + m[7] * _o.y + m[11] * _o.z + m[15] || 1.;
        this.x = (m[0] * _o.x + m[4] * _o.y + m[8] * _o.z + m[12]) / w;
        this.y = (m[1] * _o.x + m[5] * _o.y + m[9] * _o.z + m[13]) / w;
        this.y = (m[2] * _o.x + m[6] * _o.y + m[10] * _o.z + m[14]) / w;
      }

      return this;
    }
  }, {
    key: "transformByMat4New",
    value: function transformByMat4New(m) {
      return this.clone().transformByMat4(m);
    }
  }, {
    key: "transformByMat3",
    value: function transformByMat3(m) {
      if (m.array) m = m.array; // This just transforms the matrix to an array.

      if (m instanceof Array && m.length >= 9) {
        var _o2 = this.clone();

        this.x = m[0] * _o2.x + m[3] * _o2.y + m[6] * _o2.z;
        this.y = m[1] * _o2.x + m[4] * _o2.y + m[7] * _o2.z;
        this.z = m[2] * _o2.x + m[5] * _o2.y + m[8] * _o2.z;
      }

      return this;
    }
  }, {
    key: "transformByMat3New",
    value: function transformByMat3New(m) {
      return this.clone().transformByMat3(m);
    }
  }, {
    key: "transformByQuat",
    value: function transformByQuat(q) {
      if (q.array) q = q.array; // This just transforms the quaternion to an array.

      if (q instanceof Array && q.length >= 4) {
        var uv = new Vec3(q[1] * o.z - q[2] * o.y, q[2] * o.x - q[0] * o.z, q[0] * o.y - q[1] * o.x);
        var uuv = new Vec3(q[1] * uv.z - q[2] * uv.y, q[2] * uv.x - q[0] * uv.z, q[0] * uv.y - q[1] * uv.x);
        uv.scale(2 * q[3]);
        uuv.scale(2 * q[3]);
        this.add(uv);
        this.add(uuv);
      }

      return this;
    }
  }, {
    key: "transformByQuatNew",
    value: function transformByQuatNew(q) {
      return this.clone().transformByQuat(q);
    }
    /**
     * Negates the vector.
     *
     * @public
     * @chainable
     * @return {Vec3}					Returns itself, modified
     */

  }, {
    key: "negate",
    value: function negate() {
      return this.multiplyScalar(-1.);
    }
    /**
     * Clones the vector and negates it.
     *
     * @public
     * @chainable
     * @return {Vec3}					Returns itself, modified
     */

  }, {
    key: "negateNew",
    value: function negateNew() {
      return this.multiplyScalarNew(-1.);
    }
    /**
     * Inverses the vector.
     *
     * @public
     * @chainable
     * @return {Vec3}					Returns itself, modified
     */

  }, {
    key: "inverse",
    value: function inverse() {
      this.x = 1. / this.x;
      this.y = 1. / this.y;
      this.z = 1. / this.z;
      return this;
    }
    /**
     * Clones the vector and then inverses it.
     *
     * @public
     * @chainable
     * @return {Vec3}					Returns itself, modified
     */

  }, {
    key: "inverseNew",
    value: function inverseNew() {
      var c = new Vector();
      c.x = 1. / this.x;
      c.y = 1. / this.y;
      c.z = 1. / this.z;
      return c;
    }
    /**
     * Normalises the vector down to a length of 1 unit
     *
     * @public
     * @chainable
     * @return {Vec3}					Returns itself, modified
     */

  }, {
    key: "normalise",
    value: function normalise() {
      return this.divideScalar(this.length);
    }
    /**
     * Clones the vector and normalises it
     *
     * @public
     * @chainable
     * @return {Vec3}					Returns a clone of itself, modified
     */

  }, {
    key: "normaliseNew",
    value: function normaliseNew() {
      return this.divideScalarNew(this.length);
    }
    /**
     * Calculates the distance between this and the supplied vector
     *
     * @param  {Vec3} vector The vector to calculate the distance from
     * @return {number}        The distance between this and the supplied vector
     */

  }, {
    key: "distance",
    value: function distance(vector) {
      return this.subtractNew(vector).length;
    }
    /**
     * Calculates the distance on the X axis between this and the supplied vector
     *
     * @param  {Vec3} vector The vector to calculate the distance from
     * @return {number}        The distance, along the x axis, between this and the supplied vector
     */

  }, {
    key: "distanceX",
    value: function distanceX(vector) {
      return this.x - vector.x;
    }
    /**
     * Calculated the distance on the Y axis between this and the supplied vector
     *
     * @param  {Vec3} vector The vector to calculate the distance from
     * @return {number}        The distance, along the y axis, between this and the supplied vector
     */

  }, {
    key: "distanceY",
    value: function distanceY(vector) {
      return this.y - vector.y;
    }
    /**
     * Calculated the distance on the Z axis between this and the supplied vector
     *
     * @param  {Vec3} vector The vector to calculate the distance from
     * @return {number}        The distance, along the y axis, between this and the supplied vector
     */

  }, {
    key: "distanceZ",
    value: function distanceZ(vector) {
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

  }, {
    key: "dot",
    value: function dot(vector) {
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

  }, {
    key: "cross",
    value: function cross(vector) {
      return new Vec3(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
    }
  }, {
    key: "crossNew",
    value: function crossNew() {
      this.clone().cross();
    }
  }, {
    key: "ceil",
    value: function ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      return this;
    }
  }, {
    key: "ceilNew",
    value: function ceilNew() {
      return this.clone().ceil();
    }
  }, {
    key: "floor",
    value: function floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      return this;
    }
  }, {
    key: "floorNew",
    value: function floorNew() {
      return this.clone().floor();
    }
  }, {
    key: "round",
    value: function round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      return this;
    }
  }, {
    key: "roundNew",
    value: function roundNew() {
      return this.clone().round();
    }
  }, {
    key: "fract",
    value: function fract() {
      this.x -= Math.floor(this.x);
      this.y -= Math.floor(this.y);
      this.z -= Math.floor(this.z);
      return this;
    }
  }, {
    key: "fractNew",
    value: function fractNew() {
      return this.clone().fract();
    }
    /**
     * Gets the rotation axis and angle for a given
     *
     * @param  {vec3} axis  Vector receiving the axis of rotation
     * @return {Number}     Angle, in radians, of the rotation
     */

  }, {
    key: "getAxisAngle",
    value: function getAxisAngle(q) {
      if (q.array) q = q.array; // Parsing the quaternion into an array, if possible

      if (q instanceof Array && q.length >= 4) {
        var rad = Math.acos(q[3]) * 2.;
        var s = Math.sin(rad * .5);

        if (s > EPSILON) {
          this.x = q[0] / s;
          this.y = q[1] / s;
          this.z = q[2] / s;
        } else {
          this.x = 1;
          this.y = 0;
          this.z = 0;
        }
      }
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

  }, {
    key: "x",
    set: function set(x) {
      if (typeof x == 'number') {
        this._x = x;
      } else {
        throw new TypeError('X should be a number');
      }
    },
    get: function get() {
      return this._x || 0;
    }
    /**
    * (getter/setter) The y value of the vector.
    *
    * @type {number}
    * @default 0
    */

  }, {
    key: "y",
    set: function set(y) {
      if (typeof y == 'number') {
        this._y = y;
      } else {
        throw new TypeError('Y should be a number');
      }
    },
    get: function get() {
      return this._y || 0;
    }
    /**
    * (getter/setter) The y value of the vector.
    *
    * @type {number}
    * @default 0
    */

  }, {
    key: "z",
    set: function set(z) {
      if (typeof z == 'number') {
        this._z = z;
      } else {
        throw new TypeError('Y should be a number');
      }
    },
    get: function get() {
      return this._z || 0;
    }
    /**
    * (getter/setter) The length of the vector presented as a square. If you're using
    * length for comparison, this is quicker.
    *
    * @type {number}
    * @default 0
    */

  }, {
    key: "lengthSquared",
    set: function set(length) {
      var factor;

      if (typeof length == 'number') {
        factor = length / this.lengthSquared;
        this.multiplyScalar(factor);
      } else {
        throw new TypeError('length should be a number');
      }
    },
    get: function get() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
    * (getter/setter) The length of the vector
    *
    * @type {number}
    * @default 0
    */

  }, {
    key: "length",
    set: function set(length) {
      var factor;

      if (typeof length == 'number') {
        factor = length / this.length;
        this.multiplyScalar(factor);
      } else {
        throw new TypeError('length should be a number');
      }
    },
    get: function get() {
      return Math.sqrt(this.lengthSquared);
    }
    /**
     * (getter/setter) Vector width.
      * Alias of {@link Vector#x x}
     *
     * @type {number}
     */

  }, {
    key: "width",
    set: function set(w) {
      this.x = w;
    },
    get: function get() {
      return this.x;
    }
    /**
     * (getter/setter) Vector height.
      * Alias of {@link Vector#x x}
     *
     * @type {number}
     */

  }, {
    key: "height",
    set: function set(h) {
      this.y = h;
    },
    get: function get() {
      return this.y;
    }
    /**
     * (getter/setter) Vector height.
      * Alias of {@link Vector#x x}
     *
     * @type {number}
     */

  }, {
    key: "depth",
    set: function set(h) {
      this.z = h;
    },
    get: function get() {
      return this.z;
    }
    /**
     * (getter) Vector area.
     * @readonly
     *
     * @type {number}
     */

  }, {
    key: "area",
    get: function get() {
      return this.x * this.y * this.z;
    }
    /**
     * (getter) Returns the basic array representation of this vector.
     * @readonly
     *
     * @type {number}
     */

  }, {
    key: "array",
    get: function get() {
      return [this.x, this.y, this.z];
    }
    /**
     * (getter/sette) Swizzle XYZ
     *
     * @type {Vec3}
     */

  }, {
    key: "xyz",
    get: function get() {
      return new Vec3(this.x, this.y, this.z);
    },
    set: function set(v) {
      if (v instanceof Vec3) {
        this.resetToVector(v);
      } else if (v instanceof Array && v.length >= 3) {
        this.reset(v);
      } else {
        throw new Error('input should be of type Vector');
      }
    }
    /**
     * (getter/sette) Swizzle YZX
     *
     * @type {Vec3}
     */

  }, {
    key: "yzx",
    get: function get() {
      return new Vec3(this.y, this.z, this.x);
    },
    set: function set(v) {
      this.xyz = Vec3.interpolate(v).yzx;
    }
    /**
     * (getter/sette) Swizzle ZXY
     *
     * @type {Vec3}
     */

  }, {
    key: "zxy",
    get: function get() {
      return new Vec3(this.z, this.x, this.y);
    },
    set: function set(v) {
      this.xyz = Vec3.interpolate(v).zxy;
    }
    /**
     * (getter/sette) Swizzle XY
     *
     * @type {Vec2}
     */

  }, {
    key: "xy",
    get: function get() {
      return new _Vec["default"](this.x, this.y);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.x = v.x;
      this.y = v.y;
    }
    /**
     * (getter/sette) Swizzle YZ
     *
     * @type {Vec2}
     */

  }, {
    key: "yz",
    get: function get() {
      return new _Vec["default"](this.y, this.z);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.y = v.x;
      this.z = v.y;
    }
    /**
     * (getter/sette) Swizzle zx
     *
     * @type {Vec2}
     */

  }, {
    key: "zx",
    get: function get() {
      return new _Vec["default"](this.z, this.x);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.z = v.x;
      this.x = v.y;
    }
    /**
     * (getter/sette) Swizzle YX
     *
     * @type {number}
     */

  }, {
    key: "yx",
    get: function get() {
      return new _Vec["default"](this.y, this.x);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.x = v.y;
      this.y = v.x;
    }
    /**
     * (getter/sette) Swizzle ZY
     *
     * @type {number}
     */

  }, {
    key: "zy",
    get: function get() {
      return new _Vec["default"](this.z, this.y);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.z = v.y;
      this.y = v.x;
    }
    /**
     * (getter/sette) Swizzle XX
     *
     * @type {number}
     */

  }, {
    key: "xx",
    get: function get() {
      return new _Vec["default"](this.x, this.x);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.x = v.y;
    }
    /**
     * (getter/sette) Swizzle YY
     *
     * @type {number}
     */

  }, {
    key: "yy",
    get: function get() {
      return new _Vec["default"](this.y, this.y);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
      this.y = v.y;
    }
    /**
     * (getter/sette) Swizzle ZZ
     *
     * @type {number}
     */

  }, {
    key: "zz",
    get: function get() {
      return new _Vec["default"](this.z, this.z);
    },
    set: function set(v) {
      v = _Vec["default"].interpolate(v);
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

  }], [{
    key: "interpolate",
    value: function interpolate(v) {
      if (v instanceof Vec3) {
        return new Vec3(v.x, v.y, v.z);
      } else if (v instanceof Array && v.length >= 3) {
        return new Vec3(v[0], v[1], v[2]);
      } else if (!isNaN(v)) {
        return new Vec3(v, v, v);
      } else if (typeof v === 'string') {
        var nv = v.split(',');

        if (nv.length >= 3 && !isNaN(nv[0]) && !isNaN(nv[1]) && !isNaN(nv[2])) {
          return new Vec3(Number(nv[0], nv[1], nv[2]));
        }
      } else {
        throw new Error('The passed interpolant could not be parsed into a Vec3');
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

  }, {
    key: "lerp",
    value: function lerp(v1, v2, d) {
      return new Vec3(v1.x + d * (v2.x - v1.x), v1.y + d * (v2.y - v1.y), v1.z + d * (v2.z - v1.z));
    }
  }, {
    key: "getAngle",
    value: function getAngle(a, b) {
      var _a = a.xy,
          _b = b.xy;
      var len1 = _a.lengthSquared;

      if (len1 > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len1 = 1 / Math.sqrt(len1);
      }

      var len2 = _b.lengthSquared;

      if (len2 > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len2 = 1 / Math.sqrt(len2);
      }

      var cosine = (_a.x * _b.x + _a.y * _b.y) * len1 * len2;

      if (cosine > 1.0) {
        return 0;
      } else if (cosine < -1.0) {
        return Math.PI;
      } else {
        return Math.acos(cosine);
      }
    }
  }]);

  return Vec3;
}();

var _default = Vec3;
exports["default"] = _default;