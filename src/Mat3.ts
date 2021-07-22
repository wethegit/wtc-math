const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/** TO DO
 * Move these functions to a types file
 */
type DeterminantFunction = {
  f: {
    b00: number;
    b01: number;
    b02: number;
    b03: number;
    b04: number;
    b05: number;
    b06: number;
    b07: number;
    b08: number;
    b09: number;
    b10: number;
    b11: number;
  };
  determinant: number;
};
interface Mat4 {
  a11: number;
  a12: number;
  a13: number;
  a14: number;

  a21: number;
  a22: number;
  a23: number;
  a24: number;

  a31: number;
  a32: number;
  a33: number;
  a34: number;

  a41: number;
  a42: number;
  a43: number;
  a44: number;

  determinantFunction: DeterminantFunction;
}

const identToIndex = function (v: string): number {
  return [
    "a11",
    "a12",
    "a13",
    "a21",
    "a22",
    "a23",
    "a31",
    "a32",
    "a33",
  ].indexOf(v);
};

const orDefault = function (v: any, ident: string): number {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

class Mat3 {
  constructor(...args: number[]) {
    this.reset(...args);
  }

  reset(...args: number[]): Mat3 {
    const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = args;
    this.a11 = orDefault(a11, "a11");
    this.a12 = orDefault(a12, "a12");
    this.a13 = orDefault(a13, "a13");

    this.a21 = orDefault(a21, "a21");
    this.a22 = orDefault(a22, "a22");
    this.a23 = orDefault(a23, "a23");

    this.a31 = orDefault(a31, "a31");
    this.a32 = orDefault(a32, "a32");
    this.a33 = orDefault(a33, "a33");
    return this;
  }

  resetToMat3(m: Mat3): Mat3 {
    this.a11 = m.a11;
    this.a12 = m.a12;
    this.a13 = m.a13;
    this.a21 = m.a21;
    this.a22 = m.a22;
    this.a23 = m.a23;
    this.a31 = m.a31;
    this.a32 = m.a32;
    this.a33 = m.a33;
    return this;
  }

  clone(): Mat3 {
    return new Mat3(
      this.a11,
      this.a12,
      this.a13,
      this.a21,
      this.a22,
      this.a23,
      this.a31,
      this.a32,
      this.a33
    );
  }

  transpose(): Mat3 {
    const a12 = this.a12,
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

  transposeNew(): Mat3 {
    return this.clone().transpose();
  }

  adjoint(): Mat3 {
    const o = this.clone();

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

  adjointNew(): Mat3 {
    return this.clone().adjoint();
  }

  add(m: Mat3): Mat3 {
    this.a11 += m.a11;
    this.a12 += m.a12;
    this.a13 += m.a13;
    this.a21 += m.a21;
    this.a22 += m.a22;
    this.a23 += m.a23;
    this.a31 += m.a31;
    this.a32 += m.a32;
    this.a33 += m.a33;
    return this;
  }

  addNew(m: Mat3): Mat3 {
    return this.clone().add(m);
  }

  // @TODO: We might want to generalise this and allow any sort of matrix on these operations

  subtract(m: Mat3): Mat3 {
    this.a11 -= m.a11;
    this.a12 -= m.a12;
    this.a13 -= m.a13;
    this.a21 -= m.a21;
    this.a22 -= m.a22;
    this.a23 -= m.a23;
    this.a31 -= m.a31;
    this.a32 -= m.a32;
    this.a33 -= m.a33;
    return this;
  }

  subtractNew(m: Mat3): Mat3 {
    return this.clone().subtract(m);
  }

  multiply(m: Mat3): Mat3 {
    const o = this.clone();
    this.a11 = m.a11 * o.a11 + m.a12 * o.a21 + m.a13 * o.a31;
    this.a12 = m.a11 * o.a12 + m.a12 * o.a22 + m.a13 * o.a32;
    this.a13 = m.a11 * o.a13 + m.a12 * o.a23 + m.a13 * o.a33;

    this.a21 = m.a21 * o.a11 + m.a22 * o.a21 + m.a23 * o.a31;
    this.a22 = m.a21 * o.a12 + m.a22 * o.a22 + m.a23 * o.a32;
    this.a23 = m.a21 * o.a13 + m.a22 * o.a23 + m.a23 * o.a33;

    this.a31 = m.a31 * o.a11 + m.a32 * o.a21 + m.a33 * o.a31;
    this.a32 = m.a31 * o.a12 + m.a32 * o.a22 + m.a33 * o.a32;
    this.a33 = m.a31 * o.a13 + m.a32 * o.a23 + m.a33 * o.a33;
    return this;
  }

  multiplyNew(m: Mat3): Mat3 {
    return this.clone().multiply(m);
  }

  multiplyScalar(s: number): Mat3 {
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

  multiplyScalarNew(s: number): Mat3 {
    return this.clone().multiplyScalar(s);
  }

  scale(s: number): Mat3 {
    return this.multiplyScalar(s);
  }

  scaleNew(s: number): Mat3 {
    return this.multiplyScalarNew(s);
  }

  scaleByVec2(v: any): Mat3 {
    if (v.array) v = v.array;

    this.a11 *= v[0];
    this.a12 *= v[0];
    this.a13 *= v[0];

    this.a21 *= v[1];
    this.a22 *= v[1];
    this.a23 *= v[1];

    return this;
  }

  scaleByVec2New(v: any): Mat3 {
    return this.clone().scaleByVec2(v);
  }

  rotate(r: number): Mat3 {
    const o = this.clone();
    const s = Math.sin(r);
    const c = Math.cos(r);

    this.a11 = o.a11 * c + o.a21 * s;
    this.a12 = o.a12 * c + o.a22 * s;
    this.a13 = o.a13 * c + o.a23 * s;

    this.a21 = o.a21 * c - o.a11 * s;
    this.a22 = o.a22 * c - o.a12 * s;
    this.a23 = o.a23 * c - o.a13 * s;

    return this;
  }

  rotateNew(r: number): Mat3 {
    return this.clone().rotate(r);
  }

  invert(): Mat3 {
    const o = this.clone();

    const b01 = this.a33 * this.a22 - this.a23 * this.a32,
      b11 = -this.a33 * this.a21 + this.a23 * this.a31,
      b21 = this.a32 * this.a21 - this.a22 * this.a31;

    let det = this.determinant;

    // If we don't have a determinant this function should fail silently and just return the unmodified array
    if (det) {
      det = 1 / det;

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

  invertNew(): Mat3 {
    return this.clone().invert();
  }

  toString(): string {
    return `
      ${this.a11}, ${this.a12}, ${this.a13},
      ${this.a21}, ${this.a22}, ${this.a23},
      ${this.a31}, ${this.a32}, ${this.a33}
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
  #a11: number = 0;
  set a11(v) {
    if (typeof v == "number") {
      this.#a11 = v;
    } else {
      throw new TypeError("a11 should be a number");
    }
  }
  get a11() {
    return this.#a11 || 0;
  }

  /**
   * (getter/setter) The a12 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a12: number = 0;
  set a12(v) {
    if (typeof v == "number") {
      this.#a12 = v;
    } else {
      throw new TypeError("a12 should be a number");
    }
  }
  get a12() {
    return this.#a12 || 0;
  }

  /**
   * (getter/setter) The a13 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a13: number = 0;
  set a13(v) {
    if (typeof v == "number") {
      this.#a13 = v;
    } else {
      throw new TypeError("a13 should be a number");
    }
  }
  get a13() {
    return this.#a13 || 0;
  }

  /**
   * (getter/setter) The a21 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a21: number = 0;
  set a21(v) {
    if (typeof v == "number") {
      this.#a21 = v;
    } else {
      throw new TypeError("a21 should be a number");
    }
  }
  get a21() {
    return this.#a21 || 0;
  }

  /**
   * (getter/setter) The a22 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a22: number = 0;
  set a22(v) {
    if (typeof v == "number") {
      this.#a22 = v;
    } else {
      throw new TypeError("a22 should be a number");
    }
  }
  get a22() {
    return this.#a22 || 0;
  }

  /**
   * (getter/setter) The a23 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a23: number = 0;
  set a23(v) {
    if (typeof v == "number") {
      this.#a23 = v;
    } else {
      throw new TypeError("a23 should be a number");
    }
  }
  get a23() {
    return this.#a23 || 0;
  }

  /**
   * (getter/setter) The a31 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a31: number = 0;
  set a31(v) {
    if (typeof v == "number") {
      this.#a31 = v;
    } else {
      throw new TypeError("a31 should be a number");
    }
  }
  get a31() {
    return this.#a31 || 0;
  }

  /**
   * (getter/setter) The a32 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a32: number = 0;
  set a32(v) {
    if (typeof v == "number") {
      this.#a32 = v;
    } else {
      throw new TypeError("a32 should be a number");
    }
  }
  get a32() {
    return this.#a32 || 0;
  }

  /**
   * (getter/setter) The a33 value of the matrix.
   *
   * @type {number}
   * @default 0
   */
  #a33: number = 0;
  set a33(v) {
    if (typeof v == "number") {
      this.#a33 = v;
    } else {
      throw new TypeError("a33 should be a number");
    }
  }
  get a33() {
    return this.#a33 || 0;
  }

  get frobeniusnorm(): number {
    return Math.hypot(...this.array);
  }

  /**
   * (getter) Returns the basic array representation of this matrix.
   * @readonly
   *
   * @type {array}
   */
  get array(): number[] {
    return [
      this.a11,
      this.a12,
      this.a13,
      this.a21,
      this.a22,
      this.a23,
      this.a31,
      this.a32,
      this.a33,
    ];
  }

  /**
   * (getter) Returns the basic array representation of this matrix.
   * this returns the array in column-major form.
   * @readonly
   *
   * @type {array}
   */
  get columnArray(): number[] {
    return [
      this.a11,
      this.a21,
      this.a31,
      this.a12,
      this.a22,
      this.a32,
      this.a13,
      this.a23,
      this.a33,
    ];
  }

  /**
   * Calculates the determinant of the mat3
   *
   * @returns {Number} determinant of a
   */
  get determinant(): number {
    let b01 = this.a33 * this.a22 - this.a23 * this.a32;
    let b11 = -this.a33 * this.a21 + this.a23 * this.a31;
    let b21 = this.a32 * this.a21 - this.a22 * this.a31;

    return this.a11 * b01 + this.a12 * b11 + this.a13 * b21;
  }

  static fromAngle(r: number): Mat3 {
    let s = Math.sin(r);
    let c = Math.cos(r);

    return new Mat3(c, -s, 0, s, c, 0, 0, 0, 0);
  }

  static fromScalingVec2(v: any): Mat3 {
    if (v.array) v = v.array; // This just transforms a provided vector into to an array.

    if (v instanceof Array) {
      return new Mat3(v[0], 0, 0, 0, v[1], 0, 0, 0, 1);
    }
    return Mat3.identity();
  }

  static fromQuat(q: any): Mat3 {
    if (q.array) q = q.array; // This just transforms a provided vector into to an array.

    if (q instanceof Array && q.length >= 4) {
      const [x, y, z, w] = q;
      const [x2, y2, z2] = q.map((x) => x * 2);

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
        1 - yy - zz,
        yx - wz,
        zx + wy,
        yx + wz,
        1 - xx - zz,
        zy - wx,
        zx - wy,
        zy + wx,
        1 - xx - yy
      );
    }
  }

  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
   *
   * @param {mat4} a Mat4 to derive the normal matrix from
   *
   * @returns {mat3}
   */
  static fromMat4(a: Mat4): Mat3 {
    const {
      f: { b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11 },
      determinant,
    } = a.determinantFunction;

    if (!determinant) {
      return null;
    }
    const det = 1.0 / determinant;

    return new Mat3(
      (a.a22 * b11 - a.a23 * b10 + a.a24 * b09) * det,
      (a.a23 * b08 - a.a21 * b11 - a.a24 * b07) * det,
      (a.a21 * b10 - a.a22 * b08 + a.a24 * b06) * det,
      (a.a13 * b10 - a.a12 * b11 - a.a14 * b09) * det,
      (a.a11 * b11 - a.a13 * b08 + a.a14 * b07) * det,
      (a.a12 * b08 - a.a11 * b10 - a.a14 * b06) * det,
      (a.a42 * b05 - a.a43 * b04 + a.a44 * b03) * det,
      (a.a43 * b02 - a.a41 * b05 - a.a44 * b01) * det,
      (a.a41 * b04 - a.a42 * b02 + a.a44 * b00) * det
    );
  }

  /**
   * Generates a 2D projection matrix with the given bounds
   *
   * @param {number} width Width of your gl context
   * @param {number} height Height of gl context
   * @returns {mat3} out
   */
  static fromProjection(width: number, height: number): Mat3 {
    return new Mat3(2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1);
  }

  static identity(): Mat3 {
    return new Mat3(...identity);
  }
}

export { Mat3 };
