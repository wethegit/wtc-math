import { Vec2 } from "./Vec2.js";
import type { Vec2Like, QuatLike } from "./types.js";

const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];

// TO DO: Move these types to a types file
type Mat3DeterminantFunction = {
  f: {
    b01: number;
    b11: number;
    b21: number;
  };
  determinant: number;
};
type Mat4DeterminantFunction = {
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

  determinantFunction: Mat4DeterminantFunction;
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

/**
 * A 3×3 matrix, stored column-major as WebGL expects. Used for 2D affine
 * transforms (rotation, scale and translation) and for normal matrices.
 *
 * Elements are named `aCR`, column first: `a11`, `a12`, `a13` are rows 1 to 3
 * of the first column, `a21`, `a22`, `a23` the second column, and `a31`,
 * `a32`, `a33` the third. In a 2D transform the translation sits in `a31` and
 * `a32`. The constructor, {@link Mat3.reset} and {@link Mat3.array} all use
 * this order, so `array` can be passed straight to `uniformMatrix3fv`.
 *
 * Most operations come in two forms: `multiply` changes this matrix in place
 * and returns it, while `multiplyNew` returns a new matrix and leaves this one
 * unchanged.
 */
class Mat3 {
  /**
   * Create a matrix from up to nine elements in column-major order
   * (`a11`, `a12`, `a13`, `a21`, …, `a33`). Missing or non-numeric elements
   * take their identity value, so `new Mat3()` is the identity matrix.
   *
   * @param args The elements, in column-major order.
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Set every element from up to nine values in column-major order, in place.
   * Any element that is missing or not a number takes its identity value.
   * Returns this matrix, for chaining.
   *
   * @param args The elements, in column-major order.
   */
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

  /**
   * Copy every element of `m` into this matrix, in place. Returns this matrix,
   * for chaining.
   *
   * @param m The matrix to copy from.
   */
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

  /** Returns a new matrix with the same elements as this one. */
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

  /**
   * Transpose this matrix (swap rows and columns), in place. Returns this
   * matrix, for chaining.
   */
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

  /**
   * Like {@link Mat3.transpose}, but returns a new matrix and leaves this one
   * unchanged.
   */
  transposeNew(): Mat3 {
    return this.clone().transpose();
  }

  /**
   * Replace this matrix with its adjugate, in place. Returns this matrix, for
   * chaining.
   */
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

  /**
   * Like {@link Mat3.adjoint}, but returns a new matrix and leaves this one
   * unchanged.
   */
  adjointNew(): Mat3 {
    return this.clone().adjoint();
  }

  /**
   * Add `m` to this matrix element by element, in place. Returns this matrix,
   * for chaining.
   *
   * @param m The matrix to add.
   */
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

  /**
   * Like {@link Mat3.add}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param m The matrix to add.
   */
  addNew(m: Mat3): Mat3 {
    return this.clone().add(m);
  }

  // @TODO: We might want to generalise this and allow any sort of matrix on these operations

  /**
   * Subtract `m` from this matrix element by element, in place. Returns this
   * matrix, for chaining.
   *
   * @param m The matrix to subtract.
   */
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

  /**
   * Like {@link Mat3.subtract}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param m The matrix to subtract.
   */
  subtractNew(m: Mat3): Mat3 {
    return this.clone().subtract(m);
  }

  /**
   * Multiply this matrix by `m` (this × m), in place, so `m` is applied to a
   * vector first. Returns this matrix, for chaining.
   *
   * @param m The matrix to multiply by, on the right.
   */
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

  /**
   * Like {@link Mat3.multiply}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param m The matrix to multiply by, on the right.
   */
  multiplyNew(m: Mat3): Mat3 {
    return this.clone().multiply(m);
  }

  /**
   * Multiply every element by `s`, in place. Returns this matrix, for
   * chaining.
   *
   * @param s The scalar to multiply by.
   */
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

  /**
   * Like {@link Mat3.multiplyScalar}, but returns a new matrix and leaves this
   * one unchanged.
   *
   * @param s The scalar to multiply by.
   */
  multiplyScalarNew(s: number): Mat3 {
    return this.clone().multiplyScalar(s);
  }

  /**
   * Multiply every element by `s`, in place. The same as
   * {@link Mat3.multiplyScalar}, so it also scales the translation and the
   * bottom-right element; use {@link Mat3.scaleByVec2} for a 2D scale.
   * Returns this matrix, for chaining.
   *
   * @param s The scalar to multiply by.
   */
  scale(s: number): Mat3 {
    return this.multiplyScalar(s);
  }

  /**
   * Like {@link Mat3.scale}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param s The scalar to multiply by.
   */
  scaleNew(s: number): Mat3 {
    return this.multiplyScalarNew(s);
  }

  /**
   * Apply a 2D scale, in place: the first column is multiplied by `v.x` and
   * the second by `v.y`. This is this × a scaling matrix, so the scale is
   * applied to a vector before this matrix. Returns this matrix, for chaining.
   *
   * @param v The x and y scale factors, as a vector or `[x, y]` array.
   */
  scaleByVec2(v: Vec2Like): Mat3 {
    const arr: [number, number] = Array.isArray(v) ? v : [v.x, v.y];
    this.a11 *= arr[0];
    this.a12 *= arr[0];
    this.a13 *= arr[0];
    this.a21 *= arr[1];
    this.a22 *= arr[1];
    this.a23 *= arr[1];
    return this;
  }

  /**
   * Like {@link Mat3.scaleByVec2}, but returns a new matrix and leaves this
   * one unchanged.
   *
   * @param v The x and y scale factors, as a vector or `[x, y]` array.
   */
  scaleByVec2New(v: Vec2Like): Mat3 {
    return this.clone().scaleByVec2(v);
  }

  /**
   * Apply a 2D translation, in place. This is this × a translation matrix, so
   * the translation is applied to a vector before this matrix. Returns this
   * matrix, for chaining.
   *
   * @param v The x and y offsets.
   */
  translate(v: Vec2): Mat3 {
    this.a31 += v.x * this.a11 + v.y * this.a21;
    this.a32 += v.x * this.a12 + v.y * this.a22;
    this.a33 += v.x * this.a13 + v.y * this.a23;
    return this;
  }

  /**
   * Apply a 2D rotation of `r` radians anticlockwise (about the z axis), in
   * place. This is this × a rotation matrix, so the rotation is applied to a
   * vector before this matrix. The third column is unchanged. Returns this
   * matrix, for chaining.
   *
   * @param r The angle, in radians.
   */
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

  /**
   * Like {@link Mat3.rotate}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param r The angle, in radians.
   */
  rotateNew(r: number): Mat3 {
    return this.clone().rotate(r);
  }

  /**
   * Invert this matrix, in place. If the matrix is singular (its determinant
   * is 0) it is left unchanged; this method never returns null. Returns this
   * matrix, for chaining.
   */
  invert(): Mat3 {
    const o = this.clone();

    const {
      f: { b01, b11, b21 },
      determinant,
    } = this.determinantFunction;

    // If we don't have a determinant this function should fail silently and just return the unmodified array
    if (determinant) {
      const det = 1 / determinant;

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

  /**
   * Like {@link Mat3.invert}, but returns a new matrix and leaves this one
   * unchanged. A singular matrix gives an unchanged copy.
   */
  invertNew(): Mat3 {
    return this.clone().invert();
  }

  /** Returns the elements as a string, one column per line. */
  toString(): string {
    return `
      ${this.a11}, ${this.a12}, ${this.a13},
      ${this.a21}, ${this.a22}, ${this.a23},
      ${this.a31}, ${this.a32}, ${this.a33}
    `;
  }

  // Getters and setters

  #a11: number = 0;
  /**
   * Set the element at column 1, row 1. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a11(v) {
    if (typeof v == "number") {
      this.#a11 = v;
    } else {
      throw new TypeError("a11 should be a number");
    }
  }
  /**
   * The element at column 1, row 1. A stored `NaN` reads as 0.
   *
   * @default 1
   */
  get a11() {
    return this.#a11 || 0;
  }

  #a12: number = 0;
  /**
   * Set the element at column 1, row 2. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a12(v) {
    if (typeof v == "number") {
      this.#a12 = v;
    } else {
      throw new TypeError("a12 should be a number");
    }
  }
  /**
   * The element at column 1, row 2. A stored `NaN` reads as 0.
   *
   * @default 0
   */
  get a12() {
    return this.#a12 || 0;
  }

  #a13: number = 0;
  /**
   * Set the element at column 1, row 3. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a13(v) {
    if (typeof v == "number") {
      this.#a13 = v;
    } else {
      throw new TypeError("a13 should be a number");
    }
  }
  /**
   * The element at column 1, row 3. A stored `NaN` reads as 0.
   *
   * @default 0
   */
  get a13() {
    return this.#a13 || 0;
  }

  #a21: number = 0;
  /**
   * Set the element at column 2, row 1. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a21(v) {
    if (typeof v == "number") {
      this.#a21 = v;
    } else {
      throw new TypeError("a21 should be a number");
    }
  }
  /**
   * The element at column 2, row 1. A stored `NaN` reads as 0.
   *
   * @default 0
   */
  get a21() {
    return this.#a21 || 0;
  }

  #a22: number = 0;
  /**
   * Set the element at column 2, row 2. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a22(v) {
    if (typeof v == "number") {
      this.#a22 = v;
    } else {
      throw new TypeError("a22 should be a number");
    }
  }
  /**
   * The element at column 2, row 2. A stored `NaN` reads as 0.
   *
   * @default 1
   */
  get a22() {
    return this.#a22 || 0;
  }

  #a23: number = 0;
  /**
   * Set the element at column 2, row 3. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a23(v) {
    if (typeof v == "number") {
      this.#a23 = v;
    } else {
      throw new TypeError("a23 should be a number");
    }
  }
  /**
   * The element at column 2, row 3. A stored `NaN` reads as 0.
   *
   * @default 0
   */
  get a23() {
    return this.#a23 || 0;
  }

  #a31: number = 0;
  /**
   * Set the element at column 3, row 1 (the x translation in a 2D transform).
   * Throws a `TypeError` if `v` is not a number.
   */
  set a31(v) {
    if (typeof v == "number") {
      this.#a31 = v;
    } else {
      throw new TypeError("a31 should be a number");
    }
  }
  /**
   * The element at column 3, row 1 (the x translation in a 2D transform). A
   * stored `NaN` reads as 0.
   *
   * @default 0
   */
  get a31() {
    return this.#a31 || 0;
  }

  #a32: number = 0;
  /**
   * Set the element at column 3, row 2 (the y translation in a 2D transform).
   * Throws a `TypeError` if `v` is not a number.
   */
  set a32(v) {
    if (typeof v == "number") {
      this.#a32 = v;
    } else {
      throw new TypeError("a32 should be a number");
    }
  }
  /**
   * The element at column 3, row 2 (the y translation in a 2D transform). A
   * stored `NaN` reads as 0.
   *
   * @default 0
   */
  get a32() {
    return this.#a32 || 0;
  }

  #a33: number = 0;
  /**
   * Set the element at column 3, row 3. Throws a `TypeError` if `v` is not a
   * number.
   */
  set a33(v) {
    if (typeof v == "number") {
      this.#a33 = v;
    } else {
      throw new TypeError("a33 should be a number");
    }
  }
  /**
   * The element at column 3, row 3. A stored `NaN` reads as 0.
   *
   * @default 1
   */
  get a33() {
    return this.#a33 || 0;
  }

  /**
   * The Frobenius norm of the matrix: the square root of the sum of the
   * squares of all nine elements.
   */
  get frobeniusnorm(): number {
    return Math.hypot(...this.array);
  }

  /**
   * A new array of the elements in column-major order
   * (`[a11, a12, a13, a21, …, a33]`), ready for `uniformMatrix3fv`.
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
   * A new array of the elements in row-major order
   * (`[a11, a21, a31, a12, …, a33]`), which is the transpose of
   * {@link Mat3.array}. Despite the name, this is not the column-major order
   * WebGL expects; use `array` for that.
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
   * The determinant of the matrix, along with the three cofactors
   * (`f.b01`, `f.b11`, `f.b21`) that {@link Mat3.invert} reuses. Computed
   * afresh on each read. Use {@link Mat3.determinant} if you only need the
   * number.
   */
  get determinantFunction(): Mat3DeterminantFunction {
    let b01 = this.a33 * this.a22 - this.a23 * this.a32;
    let b11 = -this.a33 * this.a21 + this.a23 * this.a31;
    let b21 = this.a32 * this.a21 - this.a22 * this.a31;
    // Calculate the determinant
    return {
      f: { b01, b11, b21 },
      determinant: this.a11 * b01 + this.a12 * b11 + this.a13 * b21,
    };
  }

  /** The determinant of the matrix. */
  get determinant(): number {
    return this.determinantFunction.determinant;
  }

  /**
   * Create a 2D rotation matrix from an angle in radians.
   *
   * Note: the upper-left 2×2 is `[cos r, -sin r, sin r, cos r]` in
   * column-major order, which rotates clockwise by `r`. This is the opposite
   * direction to {@link Mat3.rotate}, so `Mat3.fromAngle(r)` equals
   * `Mat3.identity().rotate(-r)`.
   *
   * @param r The angle, in radians.
   */
  static fromAngle(r: number): Mat3 {
    let s = Math.sin(r);
    let c = Math.cos(r);

    return new Mat3(c, -s, 0, s, c, 0, 0, 0, 1);
  }

  /**
   * Create a 2D scaling matrix, with `v.x`, `v.y` and 1 on the diagonal.
   *
   * @param v The x and y scale factors, as a vector or `[x, y]` array.
   */
  static fromScalingVec2(v: Vec2Like): Mat3 {
    const arr: [number, number] = Array.isArray(v) ? v : [v.x, v.y];
    return new Mat3(arr[0], 0, 0, 0, arr[1], 0, 0, 0, 1);
  }

  /**
   * Create a rotation matrix from a quaternion. The quaternion is assumed to
   * be normalised.
   *
   * Note: the result is the transpose of the usual column-major rotation
   * matrix (the one `Mat4.fromQuat` builds), so it rotates by the inverse of
   * `q`.
   *
   * @param q The quaternion, as an object or `[x, y, z, w]` array.
   */
  static fromQuat(q: QuatLike): Mat3 {
    const qa = Array.isArray(q) ? q : [q.x, q.y, q.z, q.w];
    const [x, y, z, w] = qa;
    const [x2, y2, z2] = qa.map((n) => n * 2);

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

  /**
   * Create a normal matrix from a 4×4 matrix: the inverse transpose of its
   * upper-left 3×3. Use it to transform normals by a model or model-view
   * matrix.
   *
   * @param a The 4×4 matrix, such as a `Mat4`.
   * @returns A new matrix, or null if `a` can't be inverted.
   */
  static fromMat4(a: Mat4): Mat3 | null {
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
   * Create a 2D projection matrix that maps pixel coordinates to clip space:
   * (0, 0) at the top left becomes (-1, 1) and (width, height) at the bottom
   * right becomes (1, -1), so y points down.
   *
   * @param width The width of the canvas or viewport, in pixels.
   * @param height The height of the canvas or viewport, in pixels.
   */
  static fromProjection(width: number, height: number): Mat3 {
    return new Mat3(2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1);
  }

  /** Returns a new identity matrix. */
  static identity(): Mat3 {
    return new Mat3(...identity);
  }

  /** Iterate over the elements in column-major order, so the matrix can be spread: `[...m]`. */
  [Symbol.iterator](): Iterator<number> {
    return this.array[Symbol.iterator]();
  }
}

export { Mat3 };
