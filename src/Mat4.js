import Vec3 from './Vec3';
import Quat from './Quat';

const EPSILON = 0.0001;

const identity = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];

const identToIndex = function(v) {
  return [
    'a11', 'a12', 'a13', 'a14',
    'a21', 'a22', 'a23', 'a24',
    'a31', 'a32', 'a33', 'a34',
    'a41', 'a42', 'a43', 'a44' ].indexOf(v);
}

const orDefault = function(v, ident) {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
}

class Mat4 {
  constructor(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44) {
    this.reset(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44);
  }
  
  reset(a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44) {
    if(a11 instanceof Array && a11.length >= 15) {
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
  
  resetToMat4(m) {
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
  
  clone() {
    return new Mat4(
      this.a11, this.a12, this.a13, this.a14,
      this.a21, this.a22, this.a23, this.a24,
      this.a31, this.a32, this.a33, this.a34,
      this.a41, this.a42, this.a43, this.a44);
  }
  
  transpose() {
    const a12 = this.a12, 
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
  
  transposeNew() {
    return this.clone().transpose(m);
  }
  
  add(m) {
    if(m instanceof Mat4) {
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
  
  addNew(m) {
    return this.clone().add(m);
  }
  
  // @TODO: We might want to generalise this and allow any sort of matrix on these operations
  
  subtract(m) {
    if(m instanceof Mat4) {
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
  
  subtractNew(m) {
    return this.clone().subtract(m);
  }
  
    multiply(m) {
      if(m instanceof Mat4) {
        const o = this.clone();

        this.a11 = m.a11*o.a11 + m.a12*o.a21 + m.a13*o.a31 + m.a14*o.a41;
        this.a12 = m.a11*o.a12 + m.a12*o.a22 + m.a13*o.a32 + m.a14*o.a42;
        this.a13 = m.a11*o.a13 + m.a12*o.a23 + m.a13*o.a33 + m.a14*o.a43;
        this.a14 = m.a11*o.a14 + m.a12*o.a24 + m.a13*o.a34 + m.a14*o.a44;

        this.a21 = m.a21*o.a11 + m.a22*o.a21 + m.a23*o.a31 + m.a24*o.a41;
        this.a22 = m.a21*o.a12 + m.a22*o.a22 + m.a23*o.a32 + m.a24*o.a42;
        this.a23 = m.a21*o.a13 + m.a22*o.a23 + m.a23*o.a33 + m.a24*o.a43;
        this.a24 = m.a21*o.a14 + m.a22*o.a24 + m.a23*o.a34 + m.a24*o.a44;

        this.a31 = m.a31*o.a11 + m.a32*o.a21 + m.a33*o.a31 + m.a34*o.a41;
        this.a32 = m.a31*o.a12 + m.a32*o.a22 + m.a33*o.a32 + m.a34*o.a42;
        this.a33 = m.a31*o.a13 + m.a32*o.a23 + m.a33*o.a33 + m.a34*o.a43;
        this.a34 = m.a31*o.a14 + m.a32*o.a24 + m.a33*o.a34 + m.a34*o.a44;

        this.a41 = m.a41*o.a11 + m.a42*o.a21 + m.a43*o.a31 + m.a44*o.a41;
        this.a42 = m.a41*o.a12 + m.a42*o.a22 + m.a43*o.a32 + m.a44*o.a42;
        this.a43 = m.a41*o.a13 + m.a42*o.a23 + m.a43*o.a33 + m.a44*o.a43;
        this.a44 = m.a41*o.a14 + m.a42*o.a24 + m.a43*o.a34 + m.a44*o.a44;
      }
      return this;
    }
  
  multiplyNew(m) {
    return this.clone().multiply(m);
  }
  
  multiplyScalar(s) {
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
  
  multiplyScalarNew(s) {
    return this.clone().multiplyScalar(s);
  }
  
  scale(s) {
    return this.multiplyScalar(s);
  }
  
  scaleNew(s) {
    return this.multiplyScalarNew(s);
  }
  
  scaleByVec3(v) {
    if(v.array) v = v.array;
    
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
  
  scaleByVec3New(v) {
    this.clone().scaleByVec3(v);
  }
    
  /**
   * Transforms the mat4 by a given amount
   * 
   * @param {Vec3} v The amount to add to the matrixes transformation properties
   * @returns {mat4} output
   */
  transform(v) {
    if(v.array) v = v.array;
    if(!v.length || v.length < 3) return this;
    
    this.a14 += v[0];
    this.a24 += v[1];
    this.a34 += v[2];
    
    return this;
  }
  
  transformNew(v) {
    return this.clone().transform(v);
  }
  
  /**
   * Transforms the mat4 to a given position
   * 
   * @param {Vec3} v The amount to add to the matrixes transformation properties
   * @returns {mat4} output
   */
  transformTo(v) {
    if(v.array) v = v.array;
    if(!v.length || v.length < 3) return this;
    
    this.a14 = v[0];
    this.a24 = v[1];
    this.a34 = v[2];
    
    return this;
  }
  
  transformToew(v) {
    return this.clone().transform(v);
  }
  
  /**
   * Rotates a mat4 by the given angle around the given axis
   *
   * @param {Number} r the angle to rotate the matrix by
   * @param {vec3} axis the axis to rotate around
   * @returns {mat4} output
   */
    rotate(r, axis) {
      if(axis.array) axis = axis.array;
      if(!axis.length || axis.length < 3) return this;
      let l = Math.hypot(axis[0], axis[1], axis[2]);
      if(l < EPSILON) return this;

      l = 1./l;
      const x = axis[0] / l,
            y = axis[1] / l,
            z = axis[2] / l,
            s = Math.sin(r),
            c = Math.cos(r),
            t = 1. - c,
            o = this.clone(),
            b = new Mat4();


      // Construct the rotation matrix 3x3 matrix, but we can use a mat4 to store (w/e)
      b.a11 = x * x * t + c;
      b.a12 = y * x * t + z * s;
      b.a13 = z * x * t - y * s;

      b.a21 = x * y * t - z * s; 
      b.a22 = y * y * t + c;
      b.a23 = z * y * t + x * s;

      b.a31 = x * z * t + y * s; 
      b.a32 = y * z * t - x * s;
      b.a33 = z * z * t + c;

      // Perform rotation-specific matrix multiplication
      this.a11 = o.a11 * b.a11 + o.a21 * b.a12 + o.a31 * b.a13;
      this.a12 = o.a12 * b.a11 + o.a22 * b.a12 + o.a32 * b.a13;
      this.a13 = o.a13 * b.a11 + o.a23 * b.a12 + o.a33 * b.a13;
      this.a14 = o.a14 * b.a11 + o.a24 * b.a12 + o.a34 * b.a13;

      this.a21 = o.a11 * b.a21 + o.a21 * b.a22 + o.a31 * b.a23;
      this.a22 = o.a12 * b.a21 + o.a22 * b.a22 + o.a32 * b.a23;
      this.a23 = o.a13 * b.a21 + o.a23 * b.a22 + o.a33 * b.a23;
      this.a24 = o.a14 * b.a21 + o.a24 * b.a22 + o.a34 * b.a23;

      this.a31 = o.a11 * b.a31 + o.a21 * b.a32 + o.a31 * b.a33;
      this.a32 = o.a12 * b.a31 + o.a22 * b.a32 + o.a32 * b.a33;
      this.a33 = o.a13 * b.a31 + o.a23 * b.a32 + o.a33 * b.a33;
      this.a34 = o.a14 * b.a31 + o.a24 * b.a32 + o.a34 * b.a33;

      return this;
    }
  
  rotateNew(r, axis) {
    return this.clone().rotate(r, axis);
  }
  
  toString() {
    return `
      ${this.a11}, ${this.a12}, ${this.a13}, ${this.a14},
      ${this.a21}, ${this.a22}, ${this.a23}, ${this.a24},
      ${this.a31}, ${this.a32}, ${this.a33}, ${this.a34},
      ${this.a41}, ${this.a42}, ${this.a43}, ${this.a44}
    `;
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
  set a11(v) {
    if(typeof v == 'number') {
      this._a11 = v;
    } else {
      throw new TypeError('a11 should be a number');
    }
  }
  get a11() {
    return this._a11 || 0;
  }
  
  /**
   * (getter/setter) The a12 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a12(v) {
    if(typeof v == 'number') {
      this._a12 = v;
    } else {
      throw new TypeError('a12 should be a number');
    }
  }
  get a12() {
    return this._a12 || 0;
  }
  
  /**
   * (getter/setter) The a13 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a13(v) {
    if(typeof v == 'number') {
      this._a13 = v;
    } else {
      throw new TypeError('a13 should be a number');
    }
  }
  get a13() {
    return this._a13 || 0;
  }
  
  /**
   * (getter/setter) The a14 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a14(v) {
    if(typeof v == 'number') {
      this._a14 = v;
    } else {
      throw new TypeError('a14 should be a number');
    }
  }
  get a14() {
    return this._a14 || 0;
  }
  
  /**
   * (getter/setter) The a21 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a21(v) {
    if(typeof v == 'number') {
      this._a21 = v;
    } else {
      throw new TypeError('a21 should be a number');
    }
  }
  get a21() {
    return this._a21 || 0;
  }
  
  /**
   * (getter/setter) The a22 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a22(v) {
    if(typeof v == 'number') {
      this._a22 = v;
    } else {
      throw new TypeError('a22 should be a number');
    }
  }
  get a22() {
    return this._a22 || 0;
  }
  
  /**
   * (getter/setter) The a23 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a23(v) {
    if(typeof v == 'number') {
      this._a23 = v;
    } else {
      throw new TypeError('a23 should be a number');
    }
  }
  get a23() {
    return this._a23 || 0;
  }
  
  /**
   * (getter/setter) The a24 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a24(v) {
    if(typeof v == 'number') {
      this._a24 = v;
    } else {
      throw new TypeError('a24 should be a number');
    }
  }
  get a24() {
    return this._a24 || 0;
  }

  /**
   * (getter/setter) The a31 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a31(v) {
    if(typeof v == 'number') {
      this._a31 = v;
    } else {
      throw new TypeError('a31 should be a number');
    }
  }
  get a31() {
    return this._a31 || 0;
  }
  
  /**
   * (getter/setter) The a32 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a32(v) {
    if(typeof v == 'number') {
      this._a32 = v;
    } else {
      throw new TypeError('a32 should be a number');
    }
  }
  get a32() {
    return this._a32 || 0;
  }
  
  /**
   * (getter/setter) The a33 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a33(v) {
    if(typeof v == 'number') {
      this._a33 = v;
    } else {
      throw new TypeError('a33 should be a number');
    }
  }
  get a33() {
    return this._a33 || 0;
  }
  
  /**
   * (getter/setter) The a34 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a34(v) {
    if(typeof v == 'number') {
      this._a34 = v;
    } else {
      throw new TypeError('a34 should be a number');
    }
  }
  get a34() {
    return this._a34 || 0;
  }

  /**
   * (getter/setter) The a41 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a41(v) {
    if(typeof v == 'number') {
      this._a41 = v;
    } else {
      throw new TypeError('a41 should be a number');
    }
  }
  get a41() {
    return this._a41 || 0;
  }
  
  /**
   * (getter/setter) The a42 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a42(v) {
    if(typeof v == 'number') {
      this._a42 = v;
    } else {
      throw new TypeError('a42 should be a number');
    }
  }
  get a42() {
    return this._a42 || 0;
  }
  
  /**
   * (getter/setter) The a43 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a43(v) {
    if(typeof v == 'number') {
      this._a43 = v;
    } else {
      throw new TypeError('a43 should be a number');
    }
  }
  get a43() {
    return this._a43 || 0;
  }
  
  /**
   * (getter/setter) The a44 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  set a44(v) {
    if(typeof v == 'number') {
      this._a44 = v;
    } else {
      throw new TypeError('a44 should be a number');
    }
  }
  get a44() {
    return this._a44 || 0;
  }
  
  get frobeniusnorm() {
    return(Math.hypot(...this.array));
  }
  
  get translation() {
    return new Vec3(
      this.a41,
      this.a42,
      this.a43
    );
  }
  
  get scaling() {
    return new Vec3(
      Math.hypot(this.a11, this.a12, this.a13),
      Math.hypot(this.a21, this.a22, this.a23),
      Math.hypot(this.a31, this.a32, this.a33)
    );
  }
  
  get rotation() {
    const scale = this.scaling.inverse();
    
    let sm11 = this.a11 * scale.x;
    let sm12 = this.a12 * scale.y;
    let sm13 = this.a13 * scale.z;
    
    let sm21 = this.a21 * scale.x;
    let sm22 = this.a22 * scale.y;
    let sm23 = this.a23 * scale.z;
    
    let sm31 = this.a31 * scale.x;
    let sm32 = this.a32 * scale.y;
    let sm33 = this.a33 * scale.z;
    
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    
    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      return new Quat(
        (sm23 - sm32) / S,
        (sm31 - sm13) / S,
        (sm12 - sm21) / S,
        0.25 * S
      );
    } else if ((sm11 > sm22) && (sm11 > sm33)) {
      S = Math.sqrt(1.0 + sm11 - sm22- sm33) * 2;
      return new Quat(
        0.25 * S,
        (sm12 - sm21) / S,
        (sm31 - sm13) / S,
        (sm23 - sm32) / S
      );
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
      return new Quat(
        (sm12 - sm21) / S,
        0.25 * S,
        (sm23 - sm32) / S,
        (sm31 - sm13) / S
      );
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
      return new Quat(
        (sm31 - sm13) / S,
        (sm23 - sm32) / S,
        0.25 * S,
        (sm12 - sm21) / S
      );
    }
  }

	/**
	 * (getter) Returns the basic array representation of this matrix.
	 * @readonly
	 *
	 * @type {array}
	 */
  get array() {
    return [
      this.a11, this.a12, this.a13, this.a14,
      this.a21, this.a22, this.a23, this.a24,
      this.a31, this.a32, this.a33, this.a34,
      this.a41, this.a42, this.a43, this.a44 ];
  }
  
  static fromRotation(r, axis) {
    return new Mat4().rotate(r, axis);
  }
  
  static fromXRotation(r) {
    const s = Math.sin(r),
          c = Math.cos(r);
    
    return new Mat4(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    );
  }
  
  static fromYRotation(r) {
    const s = Math.sin(r),
          c = Math.cos(r);
    
    return new Mat4(
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    );
  }
  
  static fromZRotation(r) {
    const s = Math.sin(r),
          c = Math.cos(r);
    
    return new Mat4(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }
  
  static fromScalingVec3(v) {
    if(v.array) v = v.array; // This just transforms a provided vector into to an array.
    
    if(v instanceof Array) {
      return new Mat4(
        v[0], 0, 0, 0, 
        0, v[1], 0, 0,
        0, 0, v[2], 0,
        0, 0, 0, 1);
    }
  }
  
  static fromTranslatingVec3(v) {
    if(v.array) v = v.array; // This just transforms a provided vector into to an array.
    
    if(v instanceof Array) {
      return new Mat4(
        1, 0, 0, 0, 
        0, 1, 0, 0,
        0, 0, 1, 0,
        v[0], v[1], v[2], 1);
    }
  }
  
  static fromQuat(q) {
    if(q.array) q = q.array; // This just transforms a provided vector into to an array.
    
    if(q instanceof Array && q.length >= 4) {
      const [x, y, z, w] = q;
      const [x2, y2, z2] = q.map(x => x * 2.);
      
      const xx = x * x2,
            yx = y * x2,
            yy = y * y2,
            zx = z * x2,
            zy = z * y2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;
      
      return new Mat3(
        1 - yy -zz, yx -wz, zx + wy,
        yx + wz, 1 - xx - zz, zy - wx,
        zx - wy, zy + wx, 1 - xx - yy
      );
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
  static fromRotationTranslationScale(q, v, s) {
    if(q.array) q = q.array;
    if(v.array) v = v.array;
    if(s.array) s = s.array;
    
    if(
      q.length && q.length >= 4 && 
      v.length && v.length >= 3 && 
      s.length && s.length >= 3) {
      const x2 = q[0] + q[0],
            y2 = q[1] + q[1],
            z2 = q[2] + q[2];

      const xx = q[0] * x2,
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
      
      return new Mat4(
        (1 - (yy + zz)) * sx,
        (xy + wz) * sx,
        (xz - wy) * sx,
        0,
        (xy - wz) * sy,
        (1 - (xx + zz)) * sy,
        (yz + wx) * sy,
        0,
        (xz + wy) * sz,
        (yz - wx) * sz,
        (1 - (xx + yy)) * sz,
        0,
        v[0],
        v[1],
        v[2],
        1
      );
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
  static fromRotationTranslationScaleOrigin(q, v, s, o) {
    if(q.array) q = q.array;
    if(v.array) v = v.array;
    if(s.array) s = s.array;
    if(o.array) o = o.array;
    
    if(
      q.length && q.length >= 4 && 
      v.length && v.length >= 3 && 
      s.length && s.length >= 3 && 
      o.length && o.length >= 3) {
      const x2 = q[0] + q[0],
            y2 = q[1] + q[1],
            z2 = q[2] + q[2];

      const xx = q[0] * x2,
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

        const out0 = (1 - (yy + zz)) * sx,
              out1 = (xy + wz) * sx,
              out2 = (xz - wy) * sx,
              out4 = (xy - wz) * sy,
              out5 = (1 - (xx + zz)) * sy,
              out6 = (yz + wx) * sy,
              out8 = (xz + wy) * sz,
              out9 = (yz - wx) * sz,
              out10 = (1 - (xx + yy)) * sz;
      
        return new Mat4(
          out0,
          out1,
          out2,
          0,
          out4,
          out5,
          out6,
          0,
          out8,
          out9,
          out10,
          0,
          v[0] + ox - (out0 * ox + out4 * oy + out8 * oz),
          v[1] + oy - (out1 * ox + out5 * oy + out9 * oz),
          v[2] + oz - (out2 * ox + out6 * oy + out10 * oz),
          1
        );
    }
  }
  
  /**
   * Calculates a 4x4 matrix from the given quaternion
   *
   * @param {quat} q Quaternion to create matrix from
   *
   * @returns {mat4} out
   */
  static fromQuat(q) {
    if(q.array) q = q.array;
    
    if(q.length && q.length >=4) {
      const x2 = q[0] + q[0],
            y2 = q[1] + q[1],
            z2 = q[2] + q[2];

      const xx = q[0] * x2,
            xy = q[0] * y2,
            xz = q[0] * z2,
            yy = q[1] * y2,
            yz = q[1] * z2,
            zz = q[2] * z2,
            wx = q[3] * x2,
            wy = q[3] * y2,
            wz = q[3] * z2;
      
      return new Mat4(
        1 - yy - zz,
        yx + wz,
        zx - wy,
        0,

        yx - wz,
        1 - xx - zz,
        zy + wx,
        0,

        zx + wy,
        zy - wx,
        1 - xx - yy,
        0,
        
        0, 0, 0, 1
      );
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
  static frustum(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left),
          tb = 1 / (top - bottom),
          nf = 1 / (near - far);
    
    return new Mat4(
      (near * 2) * rl,
      0,
      0,
      0,
      
      0,
      (near * 2) * tb,
      0,
      0,
      
      (right + left) * rl,
      (top + bottom) * tb,
      (far + near) * nf,
      -1,
      
      0,
      0,
      (far * near * 2) * nf,
      0
    );
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
  static perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2)
    let nf, a33, a43;
    
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      a33 = (far + near) * nf;
      // a43 = (2 * far * near) * nf;
      a43 = 2 * far * near * nf;
    } else {
      a33 = -1;
      a43 = -2 * near;
    }
    
    const out = new Mat4(
      f / aspect, 0, 0, 0,
      
      0, f, 0, 0,
      
      0, 0, a33, -1,
      
      0, 0, a43, 0
    );
	  
    return out;
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
  static ortho(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left),
          tb = 1 / (top - bottom),
          nf = 1 / (near - far);
    
    
    return new Mat4(
      -2 * lr,
      0,
      0,
      0,
      
      0,
      -2 * bt,
      0,
      0,
      
      0,
      0,
      2 * nf,
      0,
      
      (left + right) * lr,
      (top + bottom) * bt,
      (far + near) * nf,
      1
    );
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
  static lookAt(eye, center, up) {
    
    if(eye.array) eye = eye.array;
    if(center.array) center = center.array;
    if(up.array) up = up.array;
    
    if(
      eye.length && eye.length >= 3 && 
      center.length && center.length >= 3 && 
      up.length && up.length >= 3) {
      
      const e = new Vec3(eye),
            c = new Vec3(center),
            u = new Vec3(up);
      
      if (Math.abs(e.x - c.x) < EPSILON &&
          Math.abs(e.y - c.y) < EPSILON &&
          Math.abs(e.z - c.z) < EPSILON) {
        return new Mat4();
      }
      
      const off = e.subtractNew(c);
      let l = 1./Math.hypot(off.x,off.y,off.z);
      off.x *= l;
      off.y *= l;
      off.z *= l;
      
      const or = new Vec3(
        u.y * off.z - u.z * off.y,
        u.z * off.x - u.x * off.z,
        u.x * off.y - u.y * off.x
      );
      l = Math.hypot(or.x, or.y, or.z);
      if(!l) {
        or.reset(0,0,0);
      } else {
        l = 1. / l;
        or.x *= l;
        or.y *= l;
        or.z *= l;
      }
      
      const tn = new Vec3(
        off.y * or.z - off.z * or.y,
        off.z * or.x - off.x * or.z,
        off.x * or.y - off.y * or.x
      );
      l = Math.hypot(tn.x, tn.y, tn.z);
      if(!l) {
        tn.reset(0,0,0);
      } else {
        l = 1. / l;
        tn.x *= l;
        tn.y *= l;
        tn.z *= l;
      }
      
      return new Mat4(
        or.x,
        tn.x,
        off.x,
        0,
        
        or.y,
        tn.y,
        off.y,
        0,
        
        or.z,
        tn.z,
        off.z,
        0,
        
        -(or.x * e.x + or.y * e.y + or.z * e.z),
        -(tn.x * e.x + tn.y * e.y + tn.z * e.z),
        -(off.x * e.x + off.y * e.y + off.z * e.z),
        1
      );
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
  static targetTo(eye, target, up) {
    
    if(eye.array) eye = eye.array;
    if(target.array) target = target.array;
    if(up.array) up = up.array;
    
    if(
      eye.length && eye.length >= 3 && 
      target.length && target.length >= 3 && 
      up.length && up.length >= 3) {
      
      const e = new Vec3(eye),
            c = new Vec3(target),
            u = new Vec3(up);
      
      const off = e.subtractNew(c);
      let l = off.x*off.x + off.y*off.y + off.z*off.z;
      if(l>0) {
        l = 1. / Math.sqrt(l);
        off.x *= l;
        off.y *= l;
        off.z *= l;
      }
      
      const or = new Vec3(
        u.y * off.z - u.z * off.y,
        u.z * off.x - u.x * off.z,
        u.x * off.y - u.y * off.x
      );
      l = or.x*or.x + or.y*or.y + or.z*or.z;
      if(l>0) {
        l = 1. / Math.sqrt(l);
        or.x *= l;
        or.y *= l;
        or.z *= l;
      }
      
      return new Mat4(
        or.x,
        or.y,
        or.z,
        0,
        
        off.y * or.z - off.z * or.y,
        off.z * or.x - off.x * or.z,
        off.x * or.y - off.y * or.x,
        0,
        
        off.x,
        off.y,
        off.z,
        0,
        
        e.x,
        e.y,
        e.z,
        1
      );
    }
  };
}

export default Mat4;
