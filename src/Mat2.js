const identity = [
  1, 0,
  0, 1
];

const identToIndex = function(v) {
  return ['a11', 'a12', 'a21', 'a22'].indexOf(v);
}

const orDefault = function(v, ident) {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
}

class Mat2 {
  constructor(a11, a12, a21, a22) {
    this.reset(a11, a12, a21, a22);
  }
  
  reset(a11, a12, a21, a22) {
    if(a11 instanceof Array && a11.length >= 4) {
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
  
  resetToMat2(m) {
    this.a11 = m.a11;
    this.a12 = m.a12;
    this.a21 = m.a21;
    this.a22 = m.a22;
  }
  
  clone() {
    return new Mat2(this.a11, this.a12, this.a21, this.a22);
  }
  
  transpose() {
    const a12 = this.a12;
    this.a12 = this.a21;
    this.a21 = a12;
    return this;
  }
  
  transposeNew() {
    return this.clone().transpose(m);
  }
  
  add(m) {
    if(m instanceof Mat2) {
      this.a11 += m.a11;
      this.a12 += m.a12;
      this.a21 += m.a21;
      this.a22 += m.a22;
    }
    return this;
  }
  
  addNew(m) {
    return this.clone().add(m);
  }
  
  // @TODO: We might want to generalise this and allow any sort of matrix on these operations
  
  subtract(m) {
    if(m instanceof Mat2) {
      this.a11 -= m.a11;
      this.a12 -= m.a12;
      this.a21 -= m.a21;
      this.a22 -= m.a22;
    }
    return this;
  }
  
  subtractNew(m) {
    return this.clone().subtract(m);
  }
  
  multiply(m) {
    if(m instanceof Mat2) {
      const o = this.clone();
      this.a11 = o.a11 * m.a11 + o.a21 * m.a12;
      this.a12 = o.a12 * m.a11 + o.a22 * m.a12;
      this.a21 = o.a11 * m.a21 + o.a21 * m.a22;
      this.a22 = o.a12 * m.a21 + o.a22 * m.a22;
    }
    return this;
  }
  
  multiplyNew(m) {
    return this.clone().multiply(m);
  }
  
  multiplyScalar(s) {
    this.a11 *= s;
    this.a12 *= s;
    this.a21 *= s;
    this.a22 *= s;
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
  
  scaleByVec2(v) {
    if(v.array) v = v.array; // This just transforms a provided vector into to an array.
    
    if(v instanceof Array) {
      this.a11 *= v[0];
      this.a12 *= v[0];
      this.a21 *= v[1];
      this.a22 *= v[1];
    }
    
    return this;
  }
  
  scaleByVec2New(v) {
    return this.clone().scaleByVec2(v);
  }
  
  rotate(r) {
    const o = this.clone();
    const s = Math.sin(r);
    const c = Math.cos(r);
    this.a11 = o.a11 * c + o.a21 * s;
    this.a12 = o.a12 * c + o.a22 * s;
    this.a21 = o.a11 * -s + o.a21 * c;
    this.a22 = o.a12 * -s + o.a22 * c;
    return this;
  }
  
  rotateNew(r) {
    return this.clone().rotate(r);
  }
  
  invert() {
    const c = this.clone();
    
    let det = this.determinant;
    
    // If we don't have a determinant this function should fail silently and just return the unmodified array
    if(det) {
      det = 1. / det;
      
      this.a11 = c.a22 * det;
      this.a12 = -c.a12 * det;
      this.a21 = -c.a21 * det;
      this.a22 = c.a11 * det;
    }
    
    return this;
  }
  
  invertNew() {
    return this.clone().invert();
  }
  
  /**
   * Calculates the adjugate of a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */
  adjoint() {
    const a11 = this.a11;
    this.a11 =  this.a22;
    this.a12 = -this.a12;
    this.a21 = -this.a21;
    this.a22 =  a11;

    return this;
  }
  
  adjointNew() {
    this.clone().adjoint();
  }
  
  toString() {
    return `
      ${this.a11}, ${this.a12},
      ${this.a21}, ${this.a22}
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
  
  get determinant() {
    return this.a11 * this.a21 - this.a21 * this.a12;
  }

	/**
	 * (getter) Returns the basic array representation of this matrix.
	 * @readonly
	 *
	 * @type {array}
	 */
  get array() {
    return [
      this.a11, this.a12,
      this.a21, this.a22];
  }
  
  static fromAngle(r) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    
    return new Mat2(c, -s, s, c);
  }
  
  static fromScalingVec2(v) {
    if(v.array) v = v.array; // This just transforms a provided vector into to an array.
    
    if(v instanceof Array) {
      return new Mat2(v[0], 0, 0, v[1]);
    }
  }
}

export default Mat2;