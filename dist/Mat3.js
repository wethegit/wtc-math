"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];

var identToIndex = function identToIndex(v) {
  return ['a11', 'a12', 'a13', 'a21', 'a22', 'a23', 'a31', 'a32', 'a33'].indexOf(v);
};

var orDefault = function orDefault(v, ident) {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

var Mat3 =
/*#__PURE__*/
function () {
  function Mat3(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
    _classCallCheck(this, Mat3);

    this.reset(a11, a12, a13, a21, a22, a23, a31, a32, a33);
  }

  _createClass(Mat3, [{
    key: "reset",
    value: function reset(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
      if (a11 instanceof Array && a11.length >= 9) {
        this.a11 = orDefault(a11[0], 'a11');
        this.a12 = orDefault(a11[1], 'a12');
        this.a13 = orDefault(a11[2], 'a13');
        this.a21 = orDefault(a11[3], 'a21');
        this.a22 = orDefault(a11[4], 'a22');
        this.a23 = orDefault(a11[5], 'a23');
        this.a31 = orDefault(a11[6], 'a31');
        this.a32 = orDefault(a11[7], 'a32');
        this.a33 = orDefault(a11[8], 'a33');
      } else {
        this.a11 = orDefault(a11, 'a11');
        this.a12 = orDefault(a12, 'a12');
        this.a13 = orDefault(a13, 'a13');
        this.a21 = orDefault(a21, 'a21');
        this.a22 = orDefault(a22, 'a22');
        this.a23 = orDefault(a23, 'a23');
        this.a31 = orDefault(a31, 'a31');
        this.a32 = orDefault(a32, 'a32');
        this.a33 = orDefault(a33, 'a33');
      }
    }
  }, {
    key: "resetToMat3",
    value: function resetToMat3(m) {
      this.a11 = m.a11;
      this.a12 = m.a12;
      this.a13 = m.a13;
      this.a21 = m.a21;
      this.a22 = m.a22;
      this.a23 = m.a23;
      this.a31 = m.a31;
      this.a32 = m.a32;
      this.a33 = m.a33;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Mat3(this.a11, this.a12, this.a13, this.a21, this.a22, this.a23, this.a31, this.a32, this.a33);
    }
  }, {
    key: "transpose",
    value: function transpose() {
      var a12 = this.a12,
          a13 = this.a13,
          a23 = this.a23;
      this.a12 = this.a21;
      this.a13 = this.a31;
      this.a21 = a12;
      this.a23 = this.a32;
      this.a31 = a13;
      this.a32 = a23;
      return this;
    }
  }, {
    key: "transposeNew",
    value: function transposeNew() {
      return this.clone().transpose();
    }
  }, {
    key: "invert",
    value: function invert() {
      var o = this.clone();
      var b01 = this.a33 * this.a22 - this.a23 * this.a32,
          b11 = -this.a33 * this.a21 + this.a23 * this.a31,
          b21 = this.a32 * this.a21 - this.a22 * this.a31;
      var det = this.determinant; // If we don't have a determinant this function should fail silently and just return the unmodified array

      if (det) {
        det = 1. / det;
        this.a11 = b01 * det;
        this.a12 = (-o.a33 * o.a12 + o.a13 * o.a32) * det;
        this.a13 = (o.a23 * o.a12 - o.a13 * o.a22) * det;
        this.a21 = b11 * det;
        this.a22 = (o.a33 * o.a11 - o.a13 * o.a31) * det;
        this.a23 = (-o.a23 * o.a11 + o.a13 * o.a21) * det;
        this.a31 = b21 * det;
        this.a32 = (-o.a32 * o.a11 + o.a12 * o.a31) * det;
        this.a33 = (o.a22 * o.a11 - o.a12 * o.a21) * det;
      }

      return this;
    }
  }, {
    key: "invertNew",
    value: function invertNew() {
      return this.clone().invert();
    }
  }, {
    key: "adjoint",
    value: function adjoint() {
      var o = this.clone();
      this.a11 = o.a22 * o.a33 - o.a23 * o.a32;
      this.a12 = o.a13 * o.a32 - o.a12 * o.a33;
      this.a13 = o.a12 * o.a23 - o.a13 * o.a22;
      this.a21 = o.a23 * o.a31 - o.a21 * o.a33;
      this.a22 = o.a11 * o.a33 - o.a13 * o.a31;
      this.a23 = o.a13 * o.a21 - o.a11 * o.a23;
      this.a31 = o.a21 * o.a32 - o.a22 * o.a31;
      this.a32 = o.a12 * o.a31 - o.a11 * o.a32;
      this.a33 = o.a11 * o.a22 - o.a12 * o.a21;
      return this;
    }
  }, {
    key: "adjointNew",
    value: function adjointNew() {
      return this.clone().adjoint();
    }
  }, {
    key: "add",
    value: function add(m) {
      if (m instanceof Mat3) {
        this.a11 += m.a11;
        this.a12 += m.a12;
        this.a13 += m.a13;
        this.a21 += m.a21;
        this.a22 += m.a22;
        this.a23 += m.a23;
        this.a31 += m.a31;
        this.a32 += m.a32;
        this.a33 += m.a33;
      }

      return this;
    }
  }, {
    key: "addNew",
    value: function addNew(m) {
      return this.clone().add(m);
    } // @TODO: We might want to generalise this and allow any sort of matrix on these operations

  }, {
    key: "subtract",
    value: function subtract(m) {
      if (m instanceof Mat3) {
        this.a11 -= m.a11;
        this.a12 -= m.a12;
        this.a13 -= m.a13;
        this.a21 -= m.a21;
        this.a22 -= m.a22;
        this.a23 -= m.a23;
        this.a31 -= m.a31;
        this.a32 -= m.a32;
        this.a33 -= m.a33;
      }

      return this;
    }
  }, {
    key: "subtractNew",
    value: function subtractNew(m) {
      return this.clone().subtract(m);
    }
  }, {
    key: "multiply",
    value: function multiply(m) {
      if (m instanceof Mat3) {
        var o = this.clone();
        this.a11 = m.a11 * o.a11 + m.a12 * o.a21 + m.a13 * o.a31;
        this.a12 = m.a11 * o.a12 + m.a12 * o.a22 + m.a13 * o.a32;
        this.a13 = m.a11 * o.a13 + m.a12 * o.a23 + m.a13 * o.a33;
        this.a21 = m.a21 * o.a11 + m.a22 * o.a21 + m.a23 * o.a31;
        this.a22 = m.a21 * o.a12 + m.a22 * o.a22 + m.a23 * o.a32;
        this.a23 = m.a21 * o.a13 + m.a22 * o.a23 + m.a23 * o.a33;
        this.a31 = m.a31 * o.a11 + m.a32 * o.a21 + m.a33 * o.a31;
        this.a32 = m.a31 * o.a12 + m.a32 * o.a22 + m.a33 * o.a32;
        this.a33 = m.a31 * o.a13 + m.a32 * o.a23 + m.a33 * o.a33;
      }

      return this;
    }
  }, {
    key: "multiplyNew",
    value: function multiplyNew(m) {
      return this.clone().multiply(m);
    }
  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(s) {
      this.a11 *= s;
      this.a12 *= s;
      this.a13 *= s;
      this.a21 *= s;
      this.a22 *= s;
      this.a23 *= s;
      this.a31 *= s;
      this.a32 *= s;
      this.a33 *= s;
      return this;
    }
  }, {
    key: "multiplyScalarNew",
    value: function multiplyScalarNew(s) {
      return this.clone().multiplyScalar(s);
    }
  }, {
    key: "scale",
    value: function scale(s) {
      return this.multiplyScalar(s);
    }
  }, {
    key: "scaleNew",
    value: function scaleNew(s) {
      return this.multiplyScalarNew(s);
    }
  }, {
    key: "scaleByVec2",
    value: function scaleByVec2(v) {
      if (v.array) v = v.array;
      this.a11 *= v[0];
      this.a12 *= v[0];
      this.a13 *= v[0];
      this.a21 *= v[1];
      this.a22 *= v[1];
      this.a23 *= v[1];
      return this;
    }
  }, {
    key: "scaleByVec2New",
    value: function scaleByVec2New(v) {
      this.clone().scaleByVec2(v);
    }
  }, {
    key: "rotate",
    value: function rotate(r) {
      var o = this.clone();
      var s = Math.sin(r);
      var c = Math.cos(r);
      this.a11 = o.a11 * c + o.a21 * s;
      this.a12 = o.a12 * c + o.a22 * s;
      this.a13 = o.a13 * c + o.a23 * s;
      this.a21 = o.a21 * c - o.a11 * s;
      this.a22 = o.a22 * c - o.a12 * s;
      this.a23 = o.a23 * c - o.a13 * s;
      return this;
    }
  }, {
    key: "rotateNew",
    value: function rotateNew(r) {
      return this.clone().rotate(r);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "\n      ".concat(this.a11, ", ").concat(this.a12, ", ").concat(this.a13, ",\n      ").concat(this.a21, ", ").concat(this.a22, ", ").concat(this.a23, ",\n      ").concat(this.a31, ", ").concat(this.a32, ", ").concat(this.a33, "\n    ");
    }
    /**
     * Getters and setters
     */

    /**
     * (getter/setter) The a11 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a11",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a11 = v;
      } else {
        throw new TypeError('a11 should be a number');
      }
    },
    get: function get() {
      return this._a11 || 0;
    }
    /**
     * (getter/setter) The a12 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a12",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a12 = v;
      } else {
        throw new TypeError('a12 should be a number');
      }
    },
    get: function get() {
      return this._a12 || 0;
    }
    /**
     * (getter/setter) The a13 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a13",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a13 = v;
      } else {
        throw new TypeError('a13 should be a number');
      }
    },
    get: function get() {
      return this._a13 || 0;
    }
    /**
     * (getter/setter) The a21 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a21",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a21 = v;
      } else {
        throw new TypeError('a21 should be a number');
      }
    },
    get: function get() {
      return this._a21 || 0;
    }
    /**
     * (getter/setter) The a22 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a22",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a22 = v;
      } else {
        throw new TypeError('a22 should be a number');
      }
    },
    get: function get() {
      return this._a22 || 0;
    }
    /**
     * (getter/setter) The a23 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a23",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a23 = v;
      } else {
        throw new TypeError('a23 should be a number');
      }
    },
    get: function get() {
      return this._a23 || 0;
    }
    /**
     * (getter/setter) The a31 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a31",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a31 = v;
      } else {
        throw new TypeError('a31 should be a number');
      }
    },
    get: function get() {
      return this._a31 || 0;
    }
    /**
     * (getter/setter) The a32 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a32",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a32 = v;
      } else {
        throw new TypeError('a32 should be a number');
      }
    },
    get: function get() {
      return this._a32 || 0;
    }
    /**
     * (getter/setter) The a33 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a33",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a33 = v;
      } else {
        throw new TypeError('a33 should be a number');
      }
    },
    get: function get() {
      return this._a33 || 0;
    }
  }, {
    key: "frobeniusnorm",
    get: function get() {
      return Math.hypot.apply(Math, _toConsumableArray(this.array));
    }
    /**
     * (getter) Returns the basic array representation of this matrix.
     * @readonly
     *
     * @type {array}
     */

  }, {
    key: "array",
    get: function get() {
      return [this.a11, this.a12, this.a13, this.a21, this.a22, this.a23, this.a31, this.a32, this.a33];
    }
    /**
     * Calculates the determinant of a mat3
     *
     * @param {mat3} a the source matrix
     * @returns {Number} determinant of a
     */

  }, {
    key: "determinant",
    get: function get() {
      var b01 = this.a33 * this.a22 - this.a23 * this.a32;
      var b11 = -this.a33 * this.a21 + this.a23 * this.a31;
      var b21 = this.a32 * this.a21 - this.a22 * this.a31;
      return this.a11 * b01 + this.a12 * b11 + this.a13 * b21;
    }
  }], [{
    key: "fromAngle",
    value: function fromAngle(r) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      return new Mat3(c, -s, 0, s, c, 0, 0, 0, 0);
    }
  }, {
    key: "fromScalingVec2",
    value: function fromScalingVec2(v) {
      if (v.array) v = v.array; // This just transforms a provided vector into to an array.

      if (v instanceof Array) {
        return new Mat3(v[0], 0, 0, 0, v[1], 0, 0, 0, 1);
      }
    }
  }, {
    key: "fromQuat",
    value: function fromQuat(q) {
      if (q.array) q = q.array; // This just transforms a provided vector into to an array.

      if (q instanceof Array && q.length >= 4) {
        var _q = q,
            _q2 = _slicedToArray(_q, 4),
            x = _q2[0],
            y = _q2[1],
            z = _q2[2],
            w = _q2[3];

        var _q$map = q.map(function (x) {
          return x * 2.;
        }),
            _q$map2 = _slicedToArray(_q$map, 3),
            x2 = _q$map2[0],
            y2 = _q$map2[1],
            z2 = _q$map2[2];

        var xx = x * x2,
            yx = y * x2,
            yy = y * y2,
            zx = z * x2,
            zy = z * y2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;
        return new Mat3(1 - yy - zz, yx - wz, zx + wy, yx + wz, 1 - xx - zz, zy - wx, zx - wy, zy + wx, 1 - xx - yy);
      }
    }
    /**
    * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
    *
    * @param {mat4} a Mat4 to derive the normal matrix from
    *
    * @returns {mat3}
    */

  }, {
    key: "fromMat4",
    value: function fromMat4(a) {
      var t = [a.a11 * a.a22 - a.a12 * a.a21, a.a11 * a.a23 - a.a13 * a.a21, a.a11 * a.a24 - a.a14 * a.a21, a.a12 * a.a23 - a.a13 * a.a22, a.a12 * a.a24 - a.a14 * a.a22, a.a13 * a.a24 - a.a14 * a.a23, a.a31 * a.a42 - a.a32 * a.a41, a.a31 * a.a43 - a.a33 * a.a41, a.a31 * a.a44 - a.a34 * a.a41, a.a32 * a.a43 - a.a33 * a.a42, a.a32 * a.a44 - a.a34 * a.a42, a.a33 * a.a44 - a.a34 * a.a43]; // Calculate the determinant

      var det = t[0] * t[11] - t[1] * t[10] + t[2] * t[9] + t[3] * t[8] - t[4] * t[7] + t[5] * t[6];

      if (!det) {
        return null;
      }

      det = 1.0 / det;
      return new Mat3((a.a22 * t[11] - a.a23 * t[10] + a.a24 * t[9]) * det, (a.a23 * t[8] - a.a21 * t[11] - a.a24 * t[7]) * det, (a.a21 * t[10] - a.a22 * t[8] + a.a24 * t[6]) * det, (a.a13 * t[10] - a.a12 * t[11] - a.a14 * t[9]) * det, (a.a11 * t[11] - a.a13 * t[8] + a.a14 * t[7]) * det, (a.a12 * t[8] - a.a11 * t[10] - a.a14 * t[6]) * det, (a.a42 * t[5] - a.a43 * t[4] + a.a44 * t[3]) * det, (a.a43 * t[2] - a.a41 * t[5] - a.a44 * t[1]) * det, (a.a41 * t[4] - a.a42 * t[2] + a.a44 * t[0]) * det);
    }
    /**
     * Generates a 2D projection matrix with the given bounds
     *
     * @param {number} width Width of your gl context
     * @param {number} height Height of gl context
     * @returns {mat3} out
     */

  }, {
    key: "fromProjection",
    value: function fromProjection(width, height) {
      return new Mat3(2. / width, 0, 0, 0, -2 / height, 0, -1, 1, 1);
    }
  }]);

  return Mat3;
}();

var _default = Mat3;
exports["default"] = _default;