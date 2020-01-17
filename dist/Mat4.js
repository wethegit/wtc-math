"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Vec = _interopRequireDefault(require("./Vec3"));

var _Quat = _interopRequireDefault(require("./Quat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EPSILON = 0.0001;
var identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var identToIndex = function identToIndex(v) {
  return ['a11', 'a12', 'a13', 'a14', 'a21', 'a22', 'a23', 'a24', 'a31', 'a32', 'a33', 'a34', 'a41', 'a42', 'a43', 'a44'].indexOf(v);
};

var orDefault = function orDefault(v, ident) {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

var Mat3 =
/*#__PURE__*/
function () {
  function Mat3(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44) {
    _classCallCheck(this, Mat3);

    this.reset(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44);
  }

  _createClass(Mat3, [{
    key: "reset",
    value: function reset(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44) {
      if (a11 instanceof Array && a11.length >= 15) {
        this.a11 = orDefault(a11[0], 'a11');
        this.a12 = orDefault(a11[1], 'a12');
        this.a13 = orDefault(a11[2], 'a13');
        this.a14 = orDefault(a11[3], 'a14');
        this.a21 = orDefault(a11[4], 'a21');
        this.a22 = orDefault(a11[5], 'a22');
        this.a23 = orDefault(a11[6], 'a23');
        this.a24 = orDefault(a11[7], 'a24');
        this.a31 = orDefault(a11[8], 'a31');
        this.a32 = orDefault(a11[9], 'a32');
        this.a33 = orDefault(a11[10], 'a33');
        this.a34 = orDefault(a11[11], 'a34');
        this.a41 = orDefault(a11[12], 'a41');
        this.a42 = orDefault(a11[13], 'a42');
        this.a43 = orDefault(a11[14], 'a43');
        this.a44 = orDefault(a11[15], 'a44');
      } else {
        this.a11 = orDefault(a11, 'a11');
        this.a12 = orDefault(a12, 'a12');
        this.a13 = orDefault(a13, 'a13');
        this.a14 = orDefault(a14, 'a14');
        this.a21 = orDefault(a21, 'a21');
        this.a22 = orDefault(a22, 'a22');
        this.a23 = orDefault(a23, 'a23');
        this.a24 = orDefault(a24, 'a24');
        this.a31 = orDefault(a31, 'a31');
        this.a32 = orDefault(a32, 'a32');
        this.a33 = orDefault(a33, 'a33');
        this.a34 = orDefault(a34, 'a34');
        this.a41 = orDefault(a41, 'a41');
        this.a42 = orDefault(a42, 'a42');
        this.a43 = orDefault(a43, 'a43');
        this.a44 = orDefault(a44, 'a44');
      }
    }
  }, {
    key: "resetToMat4",
    value: function resetToMat4(m) {
      this.a11 = m.a11;
      this.a12 = m.a12;
      this.a13 = m.a13;
      this.a14 = m.a14;
      this.a21 = m.a21;
      this.a22 = m.a22;
      this.a23 = m.a23;
      this.a24 = m.a24;
      this.a31 = m.a31;
      this.a32 = m.a32;
      this.a33 = m.a33;
      this.a34 = m.a34;
      this.a41 = m.a41;
      this.a42 = m.a42;
      this.a43 = m.a43;
      this.a44 = m.a44;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Mat4(this.a11, this.a12, this.a13, this.a14, this.a21, this.a22, this.a23, this.a24, this.a31, this.a32, this.a33, this.a34, this.a41, this.a42, this.a43, this.a44);
    }
  }, {
    key: "transpose",
    value: function transpose() {
      var a12 = this.a12,
          a13 = this.a13,
          a14 = this.a14,
          a23 = this.a23,
          a24 = this.a24,
          a34 = this.a34;
      this.a12 = this.a21;
      this.a13 = this.a31;
      this.a14 = this.a41;
      this.a21 = a12;
      this.a23 = this.a32;
      this.a24 = this.a42;
      this.a31 = a13;
      this.a32 = a23;
      this.a34 = this.a43;
      this.a41 = a14;
      this.a42 = a24;
      this.a43 = a34;
      return this;
    }
  }, {
    key: "transposeNew",
    value: function transposeNew() {
      return this.clone().transpose(m);
    }
  }, {
    key: "add",
    value: function add(m) {
      if (m instanceof Mat3) {
        this.a11 += m.a11;
        this.a12 += m.a12;
        this.a13 += m.a13;
        this.a14 += m.a14;
        this.a21 += m.a21;
        this.a22 += m.a22;
        this.a23 += m.a23;
        this.a24 += m.a24;
        this.a31 += m.a31;
        this.a32 += m.a32;
        this.a33 += m.a33;
        this.a34 += m.a34;
        this.a41 += m.a41;
        this.a42 += m.a42;
        this.a43 += m.a43;
        this.a44 += m.a44;
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
        this.a14 -= m.a14;
        this.a21 -= m.a21;
        this.a22 -= m.a22;
        this.a23 -= m.a23;
        this.a24 -= m.a24;
        this.a31 -= m.a31;
        this.a32 -= m.a32;
        this.a33 -= m.a33;
        this.a34 -= m.a34;
        this.a41 -= m.a41;
        this.a42 -= m.a42;
        this.a43 -= m.a43;
        this.a44 -= m.a44;
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
        var _o = this.clone();

        this.a11 = m.a11 * this.a11 + m.a12 * this.a21 + m.a13 * this.a31 + m.a14 * this.a41;
        this.a12 = m.a11 * this.a12 + m.a12 * this.a22 + m.a13 * this.a32 + m.a14 * this.a42;
        this.a13 = m.a11 * this.a13 + m.a12 * this.a23 + m.a13 * this.a33 + m.a14 * this.a43;
        this.a14 = m.a11 * this.a14 + m.a12 * this.a24 + m.a13 * this.a34 + m.a14 * this.a44;
        this.a21 = m.a21 * this.a11 + m.a22 * this.a21 + m.a23 * this.a31 + m.a34 * this.a41;
        this.a22 = m.a21 * this.a12 + m.a22 * this.a22 + m.a23 * this.a32 + m.a34 * this.a42;
        this.a23 = m.a21 * this.a13 + m.a22 * this.a23 + m.a23 * this.a33 + m.a34 * this.a43;
        this.a24 = m.a21 * this.a14 + m.a22 * this.a24 + m.a23 * this.a34 + m.a34 * this.a44;
        this.a31 = m.a31 * this.a11 + m.a32 * this.a21 + m.a33 * this.a31 + m.a34 * this.a41;
        this.a32 = m.a31 * this.a12 + m.a32 * this.a22 + m.a33 * this.a32 + m.a34 * this.a42;
        this.a33 = m.a31 * this.a13 + m.a32 * this.a23 + m.a33 * this.a33 + m.a34 * this.a43;
        this.a34 = m.a31 * this.a14 + m.a32 * this.a24 + m.a33 * this.a34 + m.a34 * this.a44;
        this.a41 = m.a41 * this.a11 + m.a42 * this.a21 + m.a43 * this.a31 + m.a44 * this.a41;
        this.a42 = m.a41 * this.a12 + m.a42 * this.a22 + m.a43 * this.a32 + m.a44 * this.a42;
        this.a43 = m.a41 * this.a13 + m.a42 * this.a23 + m.a43 * this.a33 + m.a44 * this.a43;
        this.a44 = m.a41 * this.a14 + m.a42 * this.a24 + m.a43 * this.a34 + m.a44 * this.a44;
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
      this.a14 *= s;
      this.a21 *= s;
      this.a22 *= s;
      this.a23 *= s;
      this.a24 *= s;
      this.a31 *= s;
      this.a32 *= s;
      this.a33 *= s;
      this.a34 *= s;
      this.a41 *= s;
      this.a42 *= s;
      this.a43 *= s;
      this.a44 *= s;
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
    key: "scaleByVec3",
    value: function scaleByVec3(v) {
      if (v.array) v = v.array;
      this.a11 *= v[0];
      this.a12 *= v[0];
      this.a13 *= v[0];
      this.a14 *= v[0];
      this.a21 *= v[1];
      this.a22 *= v[1];
      this.a23 *= v[1];
      this.a24 *= v[1];
      this.a31 *= v[2];
      this.a32 *= v[2];
      this.a33 *= v[2];
      this.a34 *= v[2];
      return this;
    }
  }, {
    key: "scaleByVec3New",
    value: function scaleByVec3New(v) {
      this.clone().scaleByVec3(v);
    }
    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {Number} r the angle to rotate the matrix by
     * @param {vec3} axis the axis to rotate around
     * @returns {mat4} ou
     */

  }, {
    key: "rotate",
    value: function rotate(r, axis) {
      if (axis.array) axis = axis.array;
      if (!axis.length || axist.length < 3) return this;
      var l = Math.hypot(axis[0], axis[1], axis[2]);
      if (l < EPSILON) return this;
      l = (_readOnlyError("l"), 1. / l);
      var x = axis[0] / l,
          y = axis[1] / l,
          z = axis[2] / l,
          s = Math.sin(r),
          c = Math.cos(r),
          t = 1. - c,
          o = this.clone(),
          b = new Mat4(); // Construct the rotation matrix 3x3 matrix, but we can use a mat4 to store (w/e)

      b.a11 = x * x * t + c;
      b.a12 = y * x * t + z * s;
      b.a13 = z * x * t - y * s;
      b.a21 = x * y * t - z * s;
      b.a22 = y * y * t + c;
      b.a23 = z * y * t + x * s;
      b.a31 = x * z * t + y * s;
      b.a32 = y * z * t - x * s;
      b.a33 = z * z * t + c; // Perform rotation-specific matrix multiplication

      this.a11 = this.a11 * b.a11 + this.a21 * b.a12 + this.a31 * b.a13;
      this.a12 = this.a12 * b.a11 + this.a22 * b.a12 + this.a32 * b.a13;
      this.a13 = this.a13 * b.a11 + this.a23 * b.a12 + this.a33 * b.a13;
      this.a14 = this.a14 * b.a11 + this.a24 * b.a12 + this.a34 * b.a13;
      this.a21 = this.a11 * b.a21 + this.a21 * b.a22 + this.a31 * b.a23;
      this.a22 = this.a12 * b.a21 + this.a22 * b.a22 + this.a32 * b.a23;
      this.a23 = this.a13 * b.a21 + this.a23 * b.a22 + this.a33 * b.a23;
      this.a24 = this.a14 * b.a21 + this.a24 * b.a22 + this.a34 * b.a23;
      this.a31 = this.a11 * b.a31 + this.a21 * b.a32 + this.a31 * b.a33;
      this.a32 = this.a12 * b.a31 + this.a22 * b.a32 + this.a32 * b.a33;
      this.a33 = this.a13 * b.a31 + this.a23 * b.a32 + this.a33 * b.a33;
      this.a34 = this.a14 * b.a31 + this.a24 * b.a32 + this.a34 * b.a33;
      return this;
    }
  }, {
    key: "rotateNew",
    value: function rotateNew(r, axis) {
      return this.clone().rotate(r, axis);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "\n      ".concat(this.a11, ", ").concat(this.a12, ", ").concat(this.a13, ", ").concat(this.a14, ",\n      ").concat(this.a21, ", ").concat(this.a22, ", ").concat(this.a23, ", ").concat(this.a24, ",\n      ").concat(this.a31, ", ").concat(this.a32, ", ").concat(this.a33, ", ").concat(this.a34, ",\n      ").concat(this.a41, ", ").concat(this.a42, ", ").concat(this.a43, ", ").concat(this.a44, "\n    ");
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
     * (getter/setter) The a14 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a14",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a14 = v;
      } else {
        throw new TypeError('a14 should be a number');
      }
    },
    get: function get() {
      return this._a14 || 0;
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
     * (getter/setter) The a24 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a24",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a24 = v;
      } else {
        throw new TypeError('a24 should be a number');
      }
    },
    get: function get() {
      return this._a24 || 0;
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
    /**
     * (getter/setter) The a34 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a34",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a34 = v;
      } else {
        throw new TypeError('a34 should be a number');
      }
    },
    get: function get() {
      return this._a34 || 0;
    }
    /**
     * (getter/setter) The a41 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a41",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a41 = v;
      } else {
        throw new TypeError('a41 should be a number');
      }
    },
    get: function get() {
      return this._a41 || 0;
    }
    /**
     * (getter/setter) The a42 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a42",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a42 = v;
      } else {
        throw new TypeError('a42 should be a number');
      }
    },
    get: function get() {
      return this._a42 || 0;
    }
    /**
     * (getter/setter) The a43 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a43",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a43 = v;
      } else {
        throw new TypeError('a43 should be a number');
      }
    },
    get: function get() {
      return this._a43 || 0;
    }
    /**
     * (getter/setter) The a44 value of the matrix.
     *
     * @type {number}
     * @default 0
     */

  }, {
    key: "a44",
    set: function set(v) {
      if (typeof v == 'number') {
        this._a44 = v;
      } else {
        throw new TypeError('a44 should be a number');
      }
    },
    get: function get() {
      return this._a44 || 0;
    }
  }, {
    key: "frobeniusnorm",
    get: function get() {
      return Math.hypot.apply(Math, _toConsumableArray(this.array));
    }
  }, {
    key: "translation",
    get: function get() {
      return new _Vec["default"](this.a41, this.a42, this.a43);
    }
  }, {
    key: "scaling",
    get: function get() {
      return new _Vec["default"](Math.hypot(this.a11, this.a12, this.a13), Math.hypot(this.a21, this.a22, this.a23), Math.hypot(this.a31, this.a32, this.a33));
    }
  }, {
    key: "rotation",
    get: function get() {
      var scale = this.scaling.inverse();
      var sm11 = this.a11 * scale.x;
      var sm12 = this.a12 * scale.y;
      var sm13 = this.a13 * scale.z;
      var sm21 = this.a21 * scale.x;
      var sm22 = this.a22 * scale.y;
      var sm23 = this.a23 * scale.z;
      var sm31 = this.a31 * scale.x;
      var sm32 = this.a32 * scale.y;
      var sm33 = this.a33 * scale.z;
      var trace = sm11 + sm22 + sm33;
      var S = 0;

      if (trace > 0) {
        S = Math.sqrt(trace + 1.0) * 2;
        return new _Quat["default"]((sm23 - sm32) / S, (sm31 - sm13) / S, (sm12 - sm21) / S, 0.25 * S);
      } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
        return new _Quat["default"](0.25 * S, (sm12 - sm21) / S, (sm31 - sm13) / S, (sm23 - sm32) / S);
      } else if (sm22 > sm33) {
        S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
        return new _Quat["default"]((sm12 - sm21) / S, 0.25 * S, (sm23 - sm32) / S, (sm31 - sm13) / S);
      } else {
        S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
        return new _Quat["default"]((sm31 - sm13) / S, (sm23 - sm32) / S, 0.25 * S, (sm12 - sm21) / S);
      }
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
      return [this.a11, this.a12, this.a13, this.a14, this.a21, this.a22, this.a23, this.a24, this.a31, this.a32, this.a33, this.a34, this.a41, this.a42, this.a43, this.a44];
    }
  }], [{
    key: "fromRotation",
    value: function fromRotation(r, axis) {
      return new Mat4().rotate(r, axis);
    }
  }, {
    key: "fromXRotation",
    value: function fromXRotation(r) {
      var s = Math.sin(r),
          c = Math.cos(r);
      return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    }
  }, {
    key: "fromYRotation",
    value: function fromYRotation(r) {
      var s = Math.sin(r),
          c = Math.cos(r);
      return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    }
  }, {
    key: "fromZRotation",
    value: function fromZRotation(r) {
      var s = Math.sin(r),
          c = Math.cos(r);
      return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  }, {
    key: "fromScalingVec3",
    value: function fromScalingVec3(v) {
      if (v.array) v = v.array; // This just transforms a provided vector into to an array.

      if (v instanceof Array) {
        return new Mat3(v[0], 0, 0, 0, 0, v[1], 0, 0, 0, 0, v[2], 0, 0, 0, 0, 1);
      }
    }
  }, {
    key: "fromTranslatingVec3",
    value: function fromTranslatingVec3(v) {
      if (v.array) v = v.array; // This just transforms a provided vector into to an array.

      if (v instanceof Array) {
        return new Mat3(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v[0], v[1], v[2], 1);
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
            _yx = y * x2,
            yy = y * y2,
            _zx = z * x2,
            _zy = z * y2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        return new Mat3(1 - yy - zz, _yx - wz, _zx + wy, _yx + wz, 1 - xx - zz, _zy - wx, _zx - wy, _zy + wx, 1 - xx - yy);
      }
    }
    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     *
     * @param {quat4} q Rotation quaternion
     * @param {vec3} v Translation vector
     * @param {vec3} s Scaling vector
     * @returns {mat4} out
     */

  }, {
    key: "fromRotationTranslationScale",
    value: function fromRotationTranslationScale(q, v, s) {
      if (q.array) q = q.array;
      if (v.array) v = v.array;
      if (s.array) s = s.array;

      if (q.length && q.length >= 4 && v.length && v.length >= 3 && s.length && s.length >= 3) {
        var x2 = q[0] + q[0],
            y2 = q[1] + q[1],
            z2 = q[2] + q[2];
        var xx = q[0] * x2,
            xy = q[0] * y2,
            xz = q[0] * z2,
            yy = q[1] * y2,
            yz = q[1] * z2,
            zz = q[2] * z2,
            wx = q[3] * x2,
            wy = q[3] * y2,
            wz = q[3] * z2,
            sx = s[0],
            sy = s[1],
            sz = s[2],
            ox = o[0],
            oy = o[1],
            oz = o[2];
        return new Mat4((1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0, (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0, (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0, v[0], v[1], v[2], 1);
      }
    }
    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     mat4.translate(dest, origin);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     *     mat4.translate(dest, negativeOrigin);
     *
     * @param {quat4} q Rotation quaternion
     * @param {vec3} v Translation vector
     * @param {vec3} s Scaling vector
     * @param {vec3} o The origin vector around which to scale and rotate
     * @returns {mat4} out
     */

  }, {
    key: "fromRotationTranslationScaleOrigin",
    value: function fromRotationTranslationScaleOrigin(q, v, s, o) {
      if (q.array) q = q.array;
      if (v.array) v = v.array;
      if (s.array) s = s.array;
      if (o.array) o = o.array;

      if (q.length && q.length >= 4 && v.length && v.length >= 3 && s.length && s.length >= 3 && o.length && o.length >= 3) {
        var x2 = q[0] + q[0],
            y2 = q[1] + q[1],
            z2 = q[2] + q[2];
        var xx = q[0] * x2,
            xy = q[0] * y2,
            xz = q[0] * z2,
            yy = q[1] * y2,
            yz = q[1] * z2,
            zz = q[2] * z2,
            wx = q[3] * x2,
            wy = q[3] * y2,
            wz = q[3] * z2,
            sx = s[0],
            sy = s[1],
            sz = s[2],
            ox = o[0],
            oy = o[1],
            oz = o[2];
        var out0 = (1 - (yy + zz)) * sx,
            out1 = (xy + wz) * sx,
            out2 = (xz - wy) * sx,
            out4 = (xy - wz) * sy,
            out5 = (1 - (xx + zz)) * sy,
            out6 = (yz + wx) * sy,
            out8 = (xz + wy) * sz,
            out9 = (yz - wx) * sz,
            out10 = (1 - (xx + yy)) * sz;
        return new Mat4(out0, out1, out2, 0, out4, out5, out6, 0, out8, out9, out10, 0, v[0] + ox - (out0 * ox + out4 * oy + out8 * oz), v[1] + oy - (out1 * ox + out5 * oy + out9 * oz), v[2] + oz - (out2 * ox + out6 * oy + out10 * oz), 1);
      }
    }
    /**
     * Calculates a 4x4 matrix from the given quaternion
     *
     * @param {quat} q Quaternion to create matrix from
     *
     * @returns {mat4} out
     */

  }, {
    key: "fromQuat",
    value: function fromQuat(q) {
      if (q.array) q = q.array;

      if (q.length && q.length >= 4) {
        var x2 = q[0] + q[0],
            y2 = q[1] + q[1],
            z2 = q[2] + q[2];
        var xx = q[0] * x2,
            xy = q[0] * y2,
            xz = q[0] * z2,
            yy = q[1] * y2,
            yz = q[1] * z2,
            zz = q[2] * z2,
            wx = q[3] * x2,
            wy = q[3] * y2,
            wz = q[3] * z2;
        return new Mat4(1 - yy - zz, yx + wz, zx - wy, 0, yx - wz, 1 - xx - zz, zy + wx, 0, zx + wy, zy - wx, 1 - xx - yy, 0, 0, 0, 0, 1);
      }
    }
    /**
     * Generates a frustum matrix with the given bounds
     *
     * @param {Number} left Left bound of the frustum
     * @param {Number} right Right bound of the frustum
     * @param {Number} bottom Bottom bound of the frustum
     * @param {Number} top Top bound of the frustum
     * @param {Number} near Near bound of the frustum
     * @param {Number} far Far bound of the frustum
     * @returns {mat4} out
     */

  }, {
    key: "frustum",
    value: function frustum(left, right, bottom, top, near, far) {
      var rl = 1 / (right - left),
          tb = 1 / (top - bottom),
          nf = 1 / (near - far);
      return new Mat4(near * 2 * rl, 0, 0, 0, 0, near * 2 * tb, 0, 0, (right + left) * rl, (top + bottom) * tb, (far + near) * nf, -1, 0, 0, far * near * 2 * nf, 0);
    }
    /**
     * Generates a perspective projection matrix with the given bounds.
     * Passing null/undefined/no value for far will generate infinite projection matrix.
     *
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum, can be null or Infinity
     * @returns {mat4} out
     */

  }, {
    key: "perspective",
    value: function perspective(fovy, aspect, near, far) {
      var f = 1.0 / Math.tan(fovy / 2);
      var nf, a33, a43;

      if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        a33 = (far + near) * nf;
        a43 = 2 * far * near * nf;
      } else {
        a33 = -1;
        a43 = -2 * near;
      }

      var out = new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, a33 - 1, 0, 0, a43, 0);
    }
    /**
     * Generates a orthogonal projection matrix with the given bounds
     *
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */

  }, {
    key: "ortho",
    value: function ortho(left, right, bottom, top, near, far) {
      var rl = 1 / (right - left),
          tb = 1 / (top - bottom),
          nf = 1 / (near - far);
      return new Mat4(-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, 2 * nf, 0, (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
    }
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */

  }, {
    key: "lookAt",
    value: function lookAt(eye, center, up) {
      if (eye.array) eye = eye.array;
      if (center.array) center = center.array;
      if (up.array) up = up.array;

      if (eye.length && eye.length >= 3 && center.length && center.length >= 3 && up.length && up.length >= 3) {
        var e = new _Vec["default"](eye),
            c = new _Vec["default"](center),
            u = new _Vec["default"](up);

        if (Math.abs(e.x - c.x) < EPSILON && Math.abs(e.y - c.y) < EPSILON && Math.abs(e.z - c.z) < EPSILON) {
          return new Mat4();
        }

        var off = e.subtractNew(c);
        var l = 1. / Math.hypot(off.x, off.y, off.z);
        off.x *= l;
        off.y *= l;
        off.z *= l;
        var or = new _Vec["default"](u.y * off.z - u.z * off.y, u.z * off.x - u.x * off.z, u.x * off.y - u.y * off.x);
        l = Math.hypot(or.x, or.y, or.z);

        if (!l) {
          or.reset(0, 0, 0);
        } else {
          l = 1. / l;
          or.x *= l;
          or.y *= l;
          or.z *= l;
        }

        var tn = new _Vec["default"](off.y * or.z - off.z * or.y, off.z * or.x - off.x * or.z, off.x * or.y - off.y * or.x);
        l = Math.hypot(tn.x, tn.y, tn.z);

        if (!l) {
          tn.reset(0, 0, 0);
        } else {
          l = 1. / l;
          tn.x *= l;
          tn.y *= l;
          tn.z *= l;
        }

        return new Mat4(or.x, tn.x, off.x, 0, or.y, tn.y, off.y, 0, or.z, tn.z, off.z, 0, -(or.x * e.x + or.y * e.y + or.z * e.z), -(tn.x * e.x + tn.y * e.y + tn.z * e.z), -(off.x * e.x + off.y * e.y + off.z * e.z), 1);
      }
    }
    /**
     * Generates a matrix that makes something look at something else.
     *
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */

  }, {
    key: "targetTo",
    value: function targetTo(eye, target, up) {
      if (eye.array) eye = eye.array;
      if (target.array) target = target.array;
      if (up.array) up = up.array;

      if (eye.length && eye.length >= 3 && target.length && target.length >= 3 && up.length && up.length >= 3) {
        var e = new _Vec["default"](eye),
            c = new _Vec["default"](target),
            u = new _Vec["default"](up);
        var off = e.subtractNew(c);
        var l = off.x * off.x + off.y * off.y + off.z * off.z;

        if (l > 0) {
          l = 1. / Math.sqrt(l);
          off.x *= l;
          off.y *= l;
          off.z *= l;
        }

        var or = new _Vec["default"](u.y * off.z - u.z * off.y, u.z * off.x - u.x * off.z, u.x * off.y - u.y * off.x);
        l = or.x * or.x + or.y * or.y + or.z * or.z;

        if (l > 0) {
          l = 1. / Math.sqrt(l);
          or.x *= l;
          or.y *= l;
          or.z *= l;
        }

        return new Mat4(or.x, or.y, or.z, 0, off.y * or.z - off.z * or.y, off.z * or.x - off.x * or.z, off.x * or.y - off.y * or.x, 0, off.x, off.y, off.z, 0, e.x, e.y, e.z, 1);
      }
    }
  }]);

  return Mat3;
}();

var _default = Mat3;
exports["default"] = _default;