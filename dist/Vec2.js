"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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
 * A basic 2D Vector class that provides simple algebraic functionality in the form
 * of 2D Vectors.
 *
 * We use Getters/setters for both principle properties (x & y) as well as virtual
 * properties (rotation, length etc.).
 *
 * @class Vec2
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */


var Vec2 =
/*#__PURE__*/
function () {
  /**
   * The Vector Class constructor
   *
   * @constructor
   * @param {number} x 				The x coord
   * @param {number} y 				The y coord
   */
  function Vec2(x, y) {
    _classCallCheck(this, Vec2);

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    this.x = x;
    this.y = y;
  }
  /**
   * Resets the vector coordinates
   *
   * @public
  * @param {number|Array} x 	The x coord, OR the array to reset to
  * @param {number} y 				The y coord
   */


  _createClass(Vec2, [{
    key: "reset",
    value: function reset(x, y) {
      if (x instanceof Array && x.length >= 2) {
        this.x = x[0];
        this.y = x[1];
      } else {
        this.x = x;
        this.y = y;
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
      if (v instanceof Vec2) {
        this.x = v.x;
        this.y = v.y;
      }
    }
    /**
     * Clones the vector
     *
     * @public
     * @return {Vector}					The cloned vector
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Vec2(this.x, this.y);
    }
    /**
     * Adds one vector to another.
     *
     * @public
     * @chainable
     * @param  {Vec2}  vector The vector to add to this one
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "add",
    value: function add(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }
    /**
     * Clones the vector and adds the vector to it instead
     *
     * @public
     * @chainable
     * @param  {Vec2}  vector The vector to add to this one
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "addScalar",
    value: function addScalar(scalar) {
      return this.add(new Vec2(scalar, scalar));
    }
    /**
     * Clones the vector and adds the scalar to it instead
     *
     * @public
     * @chainable
     * @param  {number}  scalar The scalar to add to the vector
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @param  {Vec2}  vector The vector to subtract from this one
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "subtract",
    value: function subtract(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }
    /**
     * Clones the vector and subtracts the vector from it instead
     *
     * @public
     * @chainable
     * @param  {Vec2}  vector The vector to subtract from this one
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "subtractScalar",
    value: function subtractScalar(scalar) {
      return this.subtract(new Vec2(scalar, scalar));
    }
    /**
     * Clones the vector and subtracts the scalar from it instead
     *
     * @public
     * @chainable
     * @param  {number}  scalar The scalar to add to the vector
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @param  {Vec2}  vector The vector to divide this by
     * @return {Vec2}					Returns itself, modified
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

      return this;
    }
    /**
     * Clones the vector and divides it by the vector instead
     *
     * @public
     * @chainable
     * @param  {Vec2}  vector The vector to divide the clone by
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "divideScalar",
    value: function divideScalar(scalar) {
      var v = new Vec2(scalar, scalar);
      return this.divide(v);
    }
    /**
     * Clones the vector and divides it by the provided scalar.
     *
     * @public
     * @chainable
     * @param  {number}  scalar The scalar to divide both x and y by
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @param  {Vec2}  vector The vector to multiply this by
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "multiply",
    value: function multiply(vector) {
      this.x *= vector.x;
      this.y *= vector.y;
      return this;
    }
    /**
     * Clones the vector and multiplies it by the vector instead
     *
     * @public
     * @chainable
     * @param  {Vec2}  vector The vector to multiply the clone by
     * @return {Vec2}					Returns the clone of itself, modified
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
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(scalar) {
      var v = new Vec2(scalar, scalar);
      return this.multiply(v);
    }
    /**
     * Clones the vector and multiplies it by the provided scalar.
     *
     * @public
     * @chainable
     * @param  {number}  scalar The scalar to multiply both x and y by
     * @return {Vec2}					Returns the clone of itself, modified
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
    /**
     * Rotates a vecor by a given amount, provided in radians.
     *
     * @public
     * @chainable
     * @param  {number}  radian The angle, in radians, to rotate the vector by
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "rotate",
    value: function rotate(radian) {
      var x = this.x * Math.cos(radian) - this.y * Math.sin(radian);
      var y = this.x * Math.sin(radian) + this.y * Math.cos(radian);
      this.x = x;
      this.y = y;
      return this;
    }
    /**
     * Clones the vector and rotates it by the supplied radian value
     *
     * @public
     * @chainable
     * @param  {number}  radian The angle, in radians, to rotate the vector by
     * @return {Vec2}					Returns the clone of itself, modified
     */

  }, {
    key: "rotateNew",
    value: function rotateNew(radian) {
      return this.clone().rotate(radian);
    }
    /**
     * Rotates a vecor by a given amount, provided in degrees. Converts the degree
     * value to radians and runs the rotaet method.
     *
     * @public
     * @chainable
     * @param  {number}  degrees The angle, in degrees, to rotate the vector by
     * @return {Vec2}						Returns itself, modified
     */

  }, {
    key: "rotateDeg",
    value: function rotateDeg(degrees) {
      return this.rotate(degreesToRadian(degrees));
    }
    /**
     * Clones the vector and rotates it by the supplied degree value
     *
     * @public
     * @chainable
    * @param  {number}  degrees The angle, in degrees, to rotate the vector by
     * @return {Vec2}					 Returns the clone of itself, modified
     */

  }, {
    key: "rotateDegNew",
    value: function rotateDegNew(degrees) {
      return this.rotateNew(degreesToRadian(degrees));
    }
    /**
     * Alias of {@link Vector#rotate__anchor rotate}
     */

  }, {
    key: "rotateBy",
    value: function rotateBy(radian) {
      return this.rotate(radian);
    }
    /**
     * Alias of {@link Vector#rotateNew__anchor rotateNew}
     */

  }, {
    key: "rotateByNew",
    value: function rotateByNew(radian) {
      return this.rotateNew(radian);
    }
    /**
     * Alias of {@link Vector#rotateDeg__anchor rotateDeg}
     */

  }, {
    key: "rotateDegBy",
    value: function rotateDegBy(degrees) {
      return this.rotateDeg(degrees);
    }
    /**
     * Alias of {@link Vector#rotateDegNew__anchor rotateDegNew}
     */

  }, {
    key: "rotateDegByNew",
    value: function rotateDegByNew(radian) {
      return this.rotateDegNew(radian);
    }
    /**
     * Rotates a vector to a specific angle
     *
     * @public
     * @chainable
     * @param  {number}  radian The angle, in radians, to rotate the vector to
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "rotateTo",
    value: function rotateTo(radian) {
      return this.rotate(radian - this.angle);
    }
  }, {
    key: "rotateToNew",

    /**
     * Clones the vector and rotates it to the supplied radian value
     *
     * @public
     * @chainable
     * @param  {number}  radian The angle, in radians, to rotate the vector to
     * @return {Vec2}					Returns the clone of itself, modified
     */
    value: function rotateToNew(radian) {
      return this.clone().rotateTo(radian);
    }
  }, {
    key: "rotateToDeg",

    /**
     * Rotates a vecor to a given amount, provided in degrees. Converts the degree
     * value to radians and runs the rotateTo method.
     *
     * @public
     * @chainable
     * @param  {number}  degrees The angle, in degrees, to rotate the vector to
     * @return {Vec2}						Returns itself, modified
     */
    value: function rotateToDeg(degrees) {
      return this.rotateTo(degreesToRadian(degrees));
    }
    /**
     * Clones the vector and rotates it to the supplied degree value
     *
     * @public
     * @chainable
    * @param  {number}  degrees The angle, in degrees, to rotate the vector to
     * @return {Vec2}					 Returns the clone of itself, modified
     */

  }, {
    key: "rotateToDegNew",
    value: function rotateToDegNew(degrees) {
      return this.rotateToNew(degreesToRadian(degrees));
    }
    /**
     * Negates the vector.
     *
     * @public
     * @chainable
     * @return {Vec2}					Returns itself, modified
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
     * @return {Vec2}					Returns itself, modified
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
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "inverse",
    value: function inverse() {
      this.x = 1. / this.x;
      this.y = 1. / this.y;
      return this;
    }
    /**
     * Clones the vector and then inverses it.
     *
     * @public
     * @chainable
     * @return {Vec2}					Returns itself, modified
     */

  }, {
    key: "inverseNew",
    value: function inverseNew() {
      var c = new Vector();
      c.x = 1. / this.x;
      c.y = 1. / this.y;
      return c;
    }
    /**
     * Normalises the vector down to a length of 1 unit
     *
     * @public
     * @chainable
     * @return {Vec2}					Returns itself, modified
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
     * @return {Vec2}					Returns a clone of itself, modified
     */

  }, {
    key: "normaliseNew",
    value: function normaliseNew() {
      return this.divideScalarNew(this.length);
    }
    /**
     * Calculates the distance between this and the supplied vector
     *
     * @param  {Vec2} vector The vector to calculate the distance from
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
     * @param  {Vec2} vector The vector to calculate the distance from
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
     * @param  {Vec2} vector The vector to calculate the distance from
     * @return {number}        The distance, along the y axis, between this and the supplied vector
     */

  }, {
    key: "distanceY",
    value: function distanceY(vector) {
      return this.y - vector.y;
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
     * @param  {Vec2} vector The vector object against which to calculate the dot product
     * @return {number}        The dot product of the two vectors
     */

  }, {
    key: "dot",
    value: function dot(vector) {
      return this.x * vector.x + this.y * vector.y;
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
     * @param  {Vec2} vector The vector object against which to calculate the cross product
     * @return {number}        The cross product of the two vectors
     */

  }, {
    key: "cross",
    value: function cross(vector) {
      return this.x * vector.x - this.y * vector.y;
    }
  }, {
    key: "ceil",
    value: function ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
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
      return this;
    }
  }, {
    key: "fractNew",
    value: function fractNew() {
      return this.clone().fract();
    }
  }, {
    key: "transformByMat2",
    value: function transformByMat2(m) {
      if (m.array) m = m.array; // This just transforms the matrix to an array.

      if (m instanceof Array && m.length >= 4) {
        var c = this.clone();
        this.x = m[0] * c.x + m[2] * c.y;
        this.y = m[1] * c.x + m[3] * c.y;
      }

      return this;
    }
  }, {
    key: "transformByMat2New",
    value: function transformByMat2New(m) {
      return this.clone().transformByMat2(m);
    }
  }, {
    key: "transformByMat3",
    value: function transformByMat3(m) {
      if (m.array) m = m.array; // This just transforms the matrix to an array.

      if (m instanceof Array && m.length >= 9) {
        var c = this.clone();
        this.x = m[0] * c.x + m[3] * c.y + m[6];
        this.y = m[1] * c.x + m[4] * c.y + m[7];
      }

      return this;
    }
  }, {
    key: "transformByMat3New",
    value: function transformByMat3New(m) {
      return this.clone().transformByMat3(m);
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
      return this.x * this.x + this.y * this.y;
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
    * (getter/setter) The angle of the vector, in radians
    *
    * @type {number}
    * @default 0
    */

  }, {
    key: "angle",
    set: function set(radian) {
      if (typeof radian == 'number') {
        this.rotateTo(radian);
      } else {
        throw new TypeError('angle should be a number');
      }
    },
    get: function get() {
      return Math.atan2(this.y, this.x);
    }
    /**
    * (getter/setter) The angle of the vector, in radians
    *
    * @type {number}
    * @default 0
    */

  }, {
    key: "angleInDegrees",
    set: function set(degrees) {
      if (typeof degrees == 'number') {
        this.rotateToDeg(degrees);
      } else {
        throw new TypeError('angle should be a number');
      }
    },
    get: function get() {
      return radianToDegrees(Math.atan2(this.y, this.x));
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
     * (getter) Vector area.
     * @readonly
     *
     * @type {number}
     */

  }, {
    key: "area",
    get: function get() {
      return this.x * this.y;
    }
    /**
     * (getter/setter) Vector slope.
     *
     * @type {number}
     */

  }, {
    key: "slope",
    set: function set(value) {
      if (!isNaN(value)) {
        var angle = Math.atan(value);
        this.angle = angle;
      }
    },
    get: function get() {
      return this.y / this.x;
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
      return [this.x, this.y];
    }
    /**
     * (getter/sette) Swizzle XY
     *
     * @type {number}
     */

  }, {
    key: "xy",
    get: function get() {
      return new Vec2(this.x, this.y);
    },
    set: function set(v) {
      if (v instanceof Vec2) {
        this.resetToVector(v);
      } else if (v instanceof Array && v.length >= 2) {
        this.reset(v);
      } else {
        throw new Error('input should be of type Vector');
      }
    }
    /**
     * (getter/sette) Swizzle YX
     *
     * @type {number}
     */

  }, {
    key: "yx",
    get: function get() {
      return new Vec2(this.y, this.x);
    },
    set: function set(v) {
      this.xy = Vec2.interpolate(v).yx;
    }
    /**
     * (getter/sette) Swizzle XX
     *
     * @type {number}
     */

  }, {
    key: "xx",
    get: function get() {
      return new Vec2(this.x, this.x);
    },
    set: function set(v) {
      v = Vec2.interpolate(v);
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
      return new Vec2(this.y, this.y);
    },
    set: function set(v) {
      v = Vec2.interpolate(v);
      this.y = v.y;
    }
    /**
     * Static methods
     */

    /**
     * Iterpolates a provided anonymous value into a vew Vec2
     *
     * @param {Vec2|array|string|number} v The value to interpolate
     * @returns {Vec2} out
     */

  }], [{
    key: "interpolate",
    value: function interpolate(v) {
      if (v instanceof Vec2) {
        return new Vec2(v.x, v.y);
      } else if (v instanceof Array && v.length >= 2) {
        return new Vec2(v[0], v[1]);
      } else if (!isNaN(v)) {
        return new Vec2(v, v);
      } else if (typeof v === 'string') {
        var nv = v.split(',');

        if (nv.length >= 2 && !isNaN(nv[0]) && !isNaN(nv[1])) {
          return new Vec2(Number(nv[0], nv[1]));
        }
      } else {
        throw new Error('The passed interpolant could not be parsed into a vec2');
      }
    }
    /**
     * Performs a linear interpolation between two vec2's
     *
     * @param {vec2} v1 the first operand
     * @param {vec2} v2 the second operand
     * @param {Number} d interpolation amount in the range of 0 - 1
     * @returns {Vec2}
     */

  }, {
    key: "lerp",
    value: function lerp(v1, v2, d) {
      return new Vec2(v1.x + d * (v2.x - v1.x), v1.y + d * (v2.y - v1.y));
    }
  }, {
    key: "getAngle",
    value: function getAngle(a, b) {
      a = a.clone();
      b = b.clone();
      a.normalise();
      b.normalise();
      var cosine = a.dot(b);

      if (cosine > 1.0) {
        return 0;
      } else if (cosine < -1.0) {
        return Math.PI;
      } else {
        return Math.acos(cosine);
      }
    }
  }]);

  return Vec2;
}();

var _default = Vec2;
exports["default"] = _default;