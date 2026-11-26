import type { Vec2Like } from "./types.js";

const identity = [1, 0, 0, 1];

const identToIndex = function (v: string): number {
  return ["a11", "a12", "a21", "a22"].indexOf(v);
};

const orDefault = function (v: any, ident: string): number {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

/**
 * A 2×2 matrix, stored column-major as WebGL expects.
 *
 * Elements are named `aCR`, column first: `a11` and `a12` are rows 1 and 2 of
 * the first column, `a21` and `a22` rows 1 and 2 of the second. The
 * constructor, {@link Mat2.reset} and {@link Mat2.array} all use this order,
 * so `array` can be passed straight to `uniformMatrix2fv`.
 *
 * Most operations come in two forms: `multiply` changes this matrix in place
 * and returns it, while `multiplyNew` returns a new matrix and leaves this one
 * unchanged.
 */
class Mat2 {
  /**
   * Create a matrix from up to four elements in column-major order
   * (`a11`, `a12`, `a21`, `a22`). Missing or non-numeric elements take their
   * identity value, so `new Mat2()` is the identity matrix.
   *
   * @param args The elements, in column-major order.
   */
  constructor(...args: number[]) {
    const [a11, a12, a21, a22] = args;
    this.reset(a11, a12, a21, a22);
  }

  /**
   * Set every element, in place. Any element that is missing or not a number
   * takes its identity value. Returns this matrix, for chaining.
   *
   * @param a11 Column 1, row 1.
   * @param a12 Column 1, row 2.
   * @param a21 Column 2, row 1.
   * @param a22 Column 2, row 2.
   */
  reset(a11: number, a12: number, a21: number, a22: number): Mat2 {
    this.a11 = orDefault(a11, "a11");
    this.a12 = orDefault(a12, "a12");
    this.a21 = orDefault(a21, "a21");
    this.a22 = orDefault(a22, "a22");
    return this;
  }

  /**
   * Copy every element of `m` into this matrix, in place. Returns this matrix,
   * for chaining.
   *
   * @param m The matrix to copy from.
   */
  resetToMat2(m: Mat2): Mat2 {
    this.a11 = m.a11;
    this.a12 = m.a12;
    this.a21 = m.a21;
    this.a22 = m.a22;
    return this;
  }

  /** Returns a new matrix with the same elements as this one. */
  clone(): Mat2 {
    return new Mat2(this.a11, this.a12, this.a21, this.a22);
  }

  /**
   * Transpose this matrix (swap rows and columns), in place. Returns this
   * matrix, for chaining.
   */
  transpose(): Mat2 {
    const a12 = this.a12;
    this.a12 = this.a21;
    this.a21 = a12;
    return this;
  }

  /**
   * Like {@link Mat2.transpose}, but returns a new matrix and leaves this one
   * unchanged.
   */
  transposeNew(): Mat2 {
    return this.clone().transpose();
  }

  /**
   * Add `m` to this matrix element by element, in place. Returns this matrix,
   * for chaining.
   *
   * @param m The matrix to add.
   */
  add(m: Mat2): Mat2 {
    this.a11 += m.a11;
    this.a12 += m.a12;
    this.a21 += m.a21;
    this.a22 += m.a22;
    return this;
  }

  /**
   * Like {@link Mat2.add}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param m The matrix to add.
   */
  addNew(m: Mat2): Mat2 {
    return this.clone().add(m);
  }

  // @TODO: We might want to generalise this and allow any sort of matrix on these operations

  /**
   * Subtract `m` from this matrix element by element, in place. Returns this
   * matrix, for chaining.
   *
   * @param m The matrix to subtract.
   */
  subtract(m: Mat2): Mat2 {
    this.a11 -= m.a11;
    this.a12 -= m.a12;
    this.a21 -= m.a21;
    this.a22 -= m.a22;
    return this;
  }

  /**
   * Like {@link Mat2.subtract}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param m The matrix to subtract.
   */
  subtractNew(m: Mat2): Mat2 {
    return this.clone().subtract(m);
  }

  /**
   * Multiply this matrix by `m` (this × m), in place, so `m` is applied to a
   * vector first. Returns this matrix, for chaining.
   *
   * @param m The matrix to multiply by, on the right.
   */
  multiply(m: Mat2): Mat2 {
    const o = this.clone();
    this.a11 = o.a11 * m.a11 + o.a21 * m.a12;
    this.a12 = o.a12 * m.a11 + o.a22 * m.a12;
    this.a21 = o.a11 * m.a21 + o.a21 * m.a22;
    this.a22 = o.a12 * m.a21 + o.a22 * m.a22;
    return this;
  }

  /**
   * Like {@link Mat2.multiply}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param m The matrix to multiply by, on the right.
   */
  multiplyNew(m: Mat2): Mat2 {
    return this.clone().multiply(m);
  }

  /**
   * Multiply every element by `s`, in place. Returns this matrix, for
   * chaining.
   *
   * @param s The scalar to multiply by.
   */
  multiplyScalar(s: number): Mat2 {
    this.a11 *= s;
    this.a12 *= s;
    this.a21 *= s;
    this.a22 *= s;
    return this;
  }

  /**
   * Like {@link Mat2.multiplyScalar}, but returns a new matrix and leaves this
   * one unchanged.
   *
   * @param s The scalar to multiply by.
   */
  multiplyScalarNew(s: number): Mat2 {
    return this.clone().multiplyScalar(s);
  }

  /**
   * Multiply every element by `s`, in place. The same as
   * {@link Mat2.multiplyScalar}. Returns this matrix, for chaining.
   *
   * @param s The scalar to multiply by.
   */
  scale(s: number): Mat2 {
    return this.multiplyScalar(s);
  }

  /**
   * Like {@link Mat2.scale}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param s The scalar to multiply by.
   */
  scaleNew(s: number): Mat2 {
    return this.multiplyScalarNew(s);
  }

  /**
   * Scale the first column by `v.x` and the second by `v.y`, in place. This
   * is this × a scaling matrix, so the scale is applied to a vector before
   * this matrix. Returns this matrix, for chaining.
   *
   * @param v The x and y scale factors, as a vector or `[x, y]` array.
   */
  scaleByVec2(v: Vec2Like): Mat2 {
    const arr: [number, number] = Array.isArray(v) ? v : [v.x, v.y];
    this.a11 *= arr[0];
    this.a12 *= arr[0];
    this.a21 *= arr[1];
    this.a22 *= arr[1];
    return this;
  }

  /**
   * Like {@link Mat2.scaleByVec2}, but returns a new matrix and leaves this
   * one unchanged.
   *
   * @param v The x and y scale factors, as a vector or `[x, y]` array.
   */
  scaleByVec2New(v: Vec2Like): Mat2 {
    return this.clone().scaleByVec2(v);
  }

  /**
   * Rotate this matrix anticlockwise by `r` radians, in place. This is
   * this × a rotation matrix, so the rotation is applied to a vector before
   * this matrix. Returns this matrix, for chaining.
   *
   * @param r The angle, in radians.
   */
  rotate(r: number): Mat2 {
    const o = this.clone();
    const s = Math.sin(r);
    const c = Math.cos(r);
    this.a11 = o.a11 * c + o.a21 * s;
    this.a12 = o.a12 * c + o.a22 * s;
    this.a21 = o.a11 * -s + o.a21 * c;
    this.a22 = o.a12 * -s + o.a22 * c;
    return this;
  }

  /**
   * Like {@link Mat2.rotate}, but returns a new matrix and leaves this one
   * unchanged.
   *
   * @param r The angle, in radians.
   */
  rotateNew(r: number): Mat2 {
    return this.clone().rotate(r);
  }

  /**
   * Invert this matrix, in place. If the matrix is singular (its determinant
   * is 0) it is left unchanged; this method never returns null. Returns this
   * matrix, for chaining.
   */
  invert(): Mat2 {
    const c = this.clone();

    let det = this.determinant;

    // If we don't have a determinant this function should fail silently and just return the unmodified array
    if (det) {
      det = 1 / det;

      this.a11 = c.a22 * det;
      this.a12 = -c.a12 * det;
      this.a21 = -c.a21 * det;
      this.a22 = c.a11 * det;
    }

    return this;
  }

  /**
   * Like {@link Mat2.invert}, but returns a new matrix and leaves this one
   * unchanged. A singular matrix gives an unchanged copy.
   */
  invertNew(): Mat2 {
    return this.clone().invert();
  }

  /**
   * Replace this matrix with its adjugate, in place. Returns this matrix, for
   * chaining.
   */
  adjoint(): Mat2 {
    const a11 = this.a11;
    this.a11 = this.a22;
    this.a12 = -this.a12;
    this.a21 = -this.a21;
    this.a22 = a11;

    return this;
  }

  /**
   * Like {@link Mat2.adjoint}, but returns a new matrix and leaves this one
   * unchanged.
   */
  adjointNew(): Mat2 {
    return this.clone().adjoint();
  }

  /** Returns the elements as a string, one column per line. */
  toString(): string {
    return `
      ${this.a11}, ${this.a12},
      ${this.a21}, ${this.a22}
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

  /** The determinant of the matrix. */
  get determinant(): number {
    return this.a11 * this.a22 - this.a12 * this.a21;
  }

  /**
   * A new array of the elements in column-major order
   * (`[a11, a12, a21, a22]`), ready for `uniformMatrix2fv`.
   */
  get array(): number[] {
    return [this.a11, this.a12, this.a21, this.a22];
  }

  /**
   * A new array of the elements in column-major order, the same as
   * {@link Mat2.array}.
   *
   * @deprecated Use {@link Mat2.array}, or {@link Mat2.rowArray} for
   * row-major order. Older versions of this getter returned the row-major order that `rowArray` now gives.
   */
  get columnArray(): number[] {
    return this.array;
  }

  /**
   * A new array of the elements in row-major order (`[a11, a21, a12, a22]`),
   * the transpose of {@link Mat2.array}.
   */
  get rowArray(): number[] {
    return [this.a11, this.a21, this.a12, this.a22];
  }

  /**
   * Create a matrix that rotates counter-clockwise by an angle in radians,
   * the same direction as {@link Mat2.rotate}: `Mat2.fromAngle(r)` equals
   * `Mat2.identity().rotate(r)`.
   *
   * @param r The angle, in radians.
   */
  static fromAngle(r: number): Mat2 {
    const s = Math.sin(r);
    const c = Math.cos(r);

    return new Mat2(c, s, -s, c);
  }

  /**
   * Create a scaling matrix, with `v.x` and `v.y` on the diagonal.
   *
   * @param v The x and y scale factors, as a vector or `[x, y]` array.
   */
  static fromScalingVec2(v: Vec2Like): Mat2 {
    const arr: [number, number] = Array.isArray(v) ? v : [v.x, v.y];
    return new Mat2(arr[0], 0, 0, arr[1]);
  }

  /** Returns a new identity matrix. */
  static identity(): Mat2 {
    return new Mat2(...identity);
  }

  /** Iterate over the elements in column-major order, so the matrix can be spread: `[...m]`. */
  [Symbol.iterator](): Iterator<number> {
    return this.array[Symbol.iterator]();
  }
}

export { Mat2 };
