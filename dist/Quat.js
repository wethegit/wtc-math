"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Mat = _interopRequireDefault(require("./Mat3"));

var _Vec2 = _interopRequireDefault(require("./Vec3"));

var _Vec3 = _interopRequireDefault(require("./Vec4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EPSILON = 0.0001;
var identity = [0, 0, 0, 1];

var identToIndex = function identToIndex(v) {
  return ['x', 'y', 'z', 'w'].indexOf(v);
};

var orDefault = function orDefault(v, ident) {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

var Quat =
/*#__PURE__*/
function (_Vec) {
  _inherits(Quat, _Vec);

  function Quat(x, y, z, w) {
    var _this;

    _classCallCheck(this, Quat);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Quat).call(this));

    _this.reset(x, y, z, w);

    return _this;
  }

  _createClass(Quat, [{
    key: "reset",
    value: function reset(x, y, z, w) {
      if (x instanceof Array && x.length >= 4) {
        this.x = orDefault(x[0], 'x');
        this.y = orDefault(x[1], 'y');
        this.z = orDefault(x[2], 'z');
        this.w = orDefault(x[3], 'w');
      } else {
        this.x = orDefault(x, 'x');
        this.y = orDefault(y, 'y');
        this.z = orDefault(z, 'z');
        this.w = orDefault(w, 'w');
      }

      return this;
    }
  }, {
    key: "resetToQuat",
    value: function resetToQuat(q) {
      this.x = q.x;
      this.y = q.y;
      this.z = q.z;
      this.w = q.w;
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Quat(this.x, this.y, this.z, this.w);
    }
  }, {
    key: "toString",
    value: function toString() {
      return " ".concat(this.x, ", ").concat(this.y, ", ").concat(this.z, ", ").concat(this.w);
    }
  }, {
    key: "multiply",
    value: function multiply(q) {
      var a = this.clone();
      this.x = a.x * q.w + a.w * q.x + a.y * q.z - a.z * q.y;
      this.y = a.y * q.w + a.w * q.y + a.z * q.x - a.x * q.z;
      this.z = a.z * q.w + a.w * q.z + a.x * q.y - a.y * q.x;
      this.w = a.w * q.w - a.x * q.x - a.y * q.y - a.z * q.z;
      return this;
    }
  }, {
    key: "multiplyNew",
    value: function multiplyNew(q) {
      return this.clone().multiply(q);
    }
  }, {
    key: "rotateX",
    value: function rotateX(rad) {
      rad *= 0.5;
      var a = this.clone();
      var s = Math.sin(rad),
          c = Math.cos(rad);
      this.x = a.x * c + a.w * s;
      this.y = a.y * c + a.z * s;
      this.z = a.z * c - a.y * s;
      this.w = a.w * c - a.x * s;
      return this;
    }
  }, {
    key: "rotateY",
    value: function rotateY(rad) {
      rad *= 0.5;
      var a = this.clone();
      var s = Math.sin(rad),
          c = Math.cos(rad);
      this.x = a.x * c - a.z * s;
      this.y = a.y * c + a.w * s;
      this.z = a.z * c + a.x * s;
      this.w = a.w * c - a.y * s;
      return this;
    }
  }, {
    key: "rotateZ",
    value: function rotateZ(rad) {
      rad *= 0.5;
      var a = this.clone();
      var s = Math.sin(rad),
          c = Math.cos(rad);
      this.x = a.x * c + a.y * s;
      this.y = a.y * c - a.x * s;
      this.z = a.z * c + a.w * s;
      this.w = a.w * c - a.z * s;
      return this;
    }
    /**
     * Getters and setters
     */

    /**
     * (getter) Returns the basic array representation of this quaternion.
     * @readonly
     *
     * @type {array}
     */

  }, {
    key: "array",
    get: function get() {
      return [this.x, this.y, this.z, this.w];
    } // Gets the calculated W component of this quaternion.

  }, {
    key: "normalW",
    get: function get() {
      var a = this.clone().normalise();
      return Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    }
    /**
     * Static methods
     */

    /**
     * Creates a quaternion from a given axis and rotation
     *
     * @param {Vec3|Array} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @returns {Quat}
     **/

  }], [{
    key: "fromAxisAngle",
    value: function fromAxisAngle(axis, rad) {
      axis = _Vec2["default"].interpolate(axis);
      rad *= .5;
      var s = Math.sin(rad);
      return new Quat(s * axis.x, s * axis.y, s * axis.z, Math.cos(rad));
    }
  }]);

  return Quat;
}(_Vec3["default"]);

var _default = Quat;
exports["default"] = _default;