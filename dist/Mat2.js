"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var identity = [1, 0, 0, 1];

var identToIndex = function identToIndex(v) {
  return ['a11', 'a12', 'a21', 'a22'].indexOf(v);
};

var orDefault = function orDefault(v, ident) {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

var Mat2 =
/*#__PURE__*/
function () {
  function Mat2(a11, a12, a21, a22) {
    _classCallCheck(this, Mat2);

    this.reset(a11, a12, a21, a22);
  }

  _createClass(Mat2, [{
    key: "reset",
    value: function reset(a11, a12, a21, a22) {
      if (a11 instanceof Array && a11.length >= 4) {
        this.a11 = orDefault(a11[0], 'a11');
        this.a12 = orDefault(a11[1], 'a12');
        this.a21 = orDefault(a11[2], 'a21');
        this.a22 = orDefault(a11[3], 'a22');
      } else {
        this.a11 = orDefault(a11, 'a11');
        this.a12 = orDefault(a12, 'a12');
        this.a21 = orDefault(a21, 'a21');
        this.a22 = orDefault(a22, 'a22');
      }
    }
  }, {
    key: "resetToMat2",
    value: function resetToMat2(m) {
      this.a11 = m.a11;
      this.a12 = m.a12;
      this.a21 = m.a21;
      this.a22 = m.a22;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Mat2(this.a11, this.a12, this.a21, this.a22);
    }
  }, {
    key: "transpose",
    value: function transpose() {
      var a12 = this.a12;
      this.a12 = this.a21;
      this.a21 = a12;
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
      if (m instanceof Mat2) {
        this.a11 += m.a11;
        this.a12 += m.a12;
        this.a21 += m.a21;
        this.a22 += m.a22;
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
      if (m instanceof Mat2) {
        this.a11 -= m.a11;
        this.a12 -= m.a12;
        this.a21 -= m.a21;
        this.a22 -= m.a22;
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
      if (m instanceof Mat2) {
        var o = this.clone();
        this.a11 = o.a11 * m.a11 + o.a21 * m.a12;
        this.a12 = o.a12 * m.a11 + o.a22 * m.a12;
        this.a21 = o.a11 * m.a21 + o.a21 * m.a22;
        this.a22 = o.a12 * m.a21 + o.a22 * m.a22;
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
      this.a21 *= s;
      this.a22 *= s;
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
      if (v.array) v = v.array; // This just transforms a provided vector into to an array.

      if (v instanceof Array) {
        this.a11 *= v[0];
        this.a12 *= v[0];
        this.a21 *= v[1];
        this.a22 *= v[1];
      }

      return this;
    }
  }, {
    key: "scaleByVec2New",
    value: function scaleByVec2New(v) {
      return this.clone().scaleByVec2(v);
    }
  }, {
    key: "rotate",
    value: function rotate(r) {
      var o = this.clone();
      var s = Math.sin(r);
      var c = Math.cos(r);
      this.a11 = o.a11 * c + o.a21 * s;
      this.a12 = o.a12 * c + o.a22 * s;
      this.a21 = o.a11 * -s + o.a21 * c;
      this.a22 = o.a12 * -s + o.a22 * c;
      return this;
    }
  }, {
    key: "rotateNew",
    value: function rotateNew(r) {
      return this.clone().rotate(r);
    }
  }, {
    key: "invert",
    value: function invert() {
      var c = this.clone();
      var det = this.determinant; // If we don't have a determinant this function should fail silently and just return the unmodified array

      if (det) {
        det = 1. / det;
        this.a11 = c.a22 * det;
        this.a12 = -c.a12 * det;
        this.a21 = -c.a21 * det;
        this.a22 = c.a11 * det;
      }

      return this;
    }
  }, {
    key: "invertNew",
    value: function invertNew() {
      return this.clone().invert();
    }
    /**
     * Calculates the adjugate of a mat2
     *
     * @param {mat2} out the receiving matrix
     * @param {mat2} a the source matrix
     * @returns {mat2} out
     */

  }, {
    key: "adjoint",
    value: function adjoint() {
      var a11 = this.a11;
      this.a11 = this.a22;
      this.a12 = -this.a12;
      this.a21 = -this.a21;
      this.a22 = a11;
      return this;
    }
  }, {
    key: "adjointNew",
    value: function adjointNew() {
      this.clone().adjoint();
    }
  }, {
    key: "toString",
    value: function toString() {
      return "\n      ".concat(this.a11, ", ").concat(this.a12, ",\n      ").concat(this.a21, ", ").concat(this.a22, "\n    ");
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
  }, {
    key: "determinant",
    get: function get() {
      return this.a11 * this.a21 - this.a21 * this.a12;
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
      return [this.a11, this.a12, this.a21, this.a22];
    }
  }], [{
    key: "fromAngle",
    value: function fromAngle(r) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      return new Mat2(c, -s, s, c);
    }
  }, {
    key: "fromScalingVec2",
    value: function fromScalingVec2(v) {
      if (v.array) v = v.array; // This just transforms a provided vector into to an array.

      if (v instanceof Array) {
        return new Mat2(v[0], 0, 0, v[1]);
      }
    }
  }]);

  return Mat2;
}();

var _default = Mat2;
exports["default"] = _default;