import { Vec3 } from "./Vec3.js";
import { Quat } from "./Quat.js";
import type { QuatLike, Vec3Like } from "./types.js";

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

const EPSILON: number = 0.0001;

const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

const identToIndex = function (v: string): number {
  return [
    "a11",
    "a12",
    "a13",
    "a14",
    "a21",
    "a22",
    "a23",
    "a24",
    "a31",
    "a32",
    "a33",
    "a34",
    "a41",
    "a42",
    "a43",
    "a44",
  ].indexOf(v);
};

const orDefault = function (v: any, ident: string): number {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

/**
 * A 4×4 matrix, used for 3D transforms, camera views and projections.
 *
 * Elements are stored column-major, as WebGL expects. Each element is named
 * `aCR`, for column C and row R: `a11`–`a14` are the first column and
 * `a41`–`a43` hold the translation. {@link Mat4.array} returns the elements in
 * that order, ready to pass to `uniformMatrix4fv`.
 *
 * Most operations change the matrix in place and return it, for chaining. Each
 * has a `…New` variant that returns a new matrix and leaves this one unchanged.
 */
class Mat4 {
  /**
   * Create a matrix. With no arguments, this is the identity matrix.
   *
   * @param args Up to 16 elements in column-major order. Any missing or `NaN` element takes its value from the identity matrix.
   */
  constructor(...args: number[]) {
    this.reset(...args);
  }

  /**
   * Set every element in place. Any missing or `NaN` element takes its value from the identity matrix, so `reset()` with no arguments sets this to the identity.
   *
   * @param args Up to 16 elements in column-major order.
   * @returns This matrix, for chaining.
   */
  reset(...args: number[]): Mat4 {
    const [
      a11,
      a12,
      a13,
      a14,
      a21,
      a22,
      a23,
      a24,
      a31,
      a32,
      a33,
      a34,
      a41,
      a42,
      a43,
      a44,
    ] = args;
    this.a11 = orDefault(a11, "a11");
    this.a12 = orDefault(a12, "a12");
    this.a13 = orDefault(a13, "a13");
    this.a14 = orDefault(a14, "a14");

    this.a21 = orDefault(a21, "a21");
    this.a22 = orDefault(a22, "a22");
    this.a23 = orDefault(a23, "a23");
    this.a24 = orDefault(a24, "a24");

    this.a31 = orDefault(a31, "a31");
    this.a32 = orDefault(a32, "a32");
    this.a33 = orDefault(a33, "a33");
    this.a34 = orDefault(a34, "a34");

    this.a41 = orDefault(a41, "a41");
    this.a42 = orDefault(a42, "a42");
    this.a43 = orDefault(a43, "a43");
    this.a44 = orDefault(a44, "a44");
    return this;
  }

  /**
   * Copy every element of another matrix into this one.
   *
   * @param m The matrix to copy.
   * @returns This matrix, for chaining.
   */
  resetToMat4(m: Mat4): Mat4 {
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

    return this;
  }

  /**
   * Create a copy of this matrix.
   *
   * @returns A new matrix with the same elements.
   */
  clone(): Mat4 {
    return new Mat4(
      this.a11,
      this.a12,
      this.a13,
      this.a14,
      this.a21,
      this.a22,
      this.a23,
      this.a24,
      this.a31,
      this.a32,
      this.a33,
      this.a34,
      this.a41,
      this.a42,
      this.a43,
      this.a44
    );
  }

  /**
   * Transpose the matrix in place, swapping rows and columns.
   *
   * @returns This matrix, for chaining.
   */
  transpose(): Mat4 {
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

  /**
   * Like {@link Mat4.transpose}, but returns a new matrix and leaves this one unchanged.
   *
   * @returns A new, transposed matrix.
   */
  transposeNew(): Mat4 {
    return this.clone().transpose();
  }

  /**
   * Add another matrix to this one in place, element by element.
   *
   * @param m The matrix to add.
   * @returns This matrix, for chaining.
   */
  add(m: Mat4): Mat4 {
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
    return this;
  }

  /**
   * Like {@link Mat4.add}, but returns a new matrix and leaves this one unchanged.
   *
   * @param m The matrix to add.
   * @returns A new matrix holding the sum.
   */
  addNew(m: Mat4): Mat4 {
    return this.clone().add(m);
  }

  // @TODO: We might want to generalise this and allow any sort of matrix on these operations

  /**
   * Subtract another matrix from this one in place, element by element.
   *
   * @param m The matrix to subtract.
   * @returns This matrix, for chaining.
   */
  subtract(m: Mat4): Mat4 {
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
    return this;
  }

  /**
   * Like {@link Mat4.subtract}, but returns a new matrix and leaves this one unchanged.
   *
   * @param m The matrix to subtract.
   * @returns A new matrix holding the difference.
   */
  subtractNew(m: Mat4): Mat4 {
    return this.clone().subtract(m);
  }

  /**
   * Multiply this matrix by another in place, so this becomes `this × m`.
   * Applied to a vector, the result transforms by `m` first, then by the
   * original matrix.
   *
   * @param m The matrix to multiply by, on the right.
   * @returns This matrix, for chaining.
   */
  multiply(m: Mat4): Mat4 {
    const o = this.clone();

    this.a11 = m.a11 * o.a11 + m.a12 * o.a21 + m.a13 * o.a31 + m.a14 * o.a41;
    this.a12 = m.a11 * o.a12 + m.a12 * o.a22 + m.a13 * o.a32 + m.a14 * o.a42;
    this.a13 = m.a11 * o.a13 + m.a12 * o.a23 + m.a13 * o.a33 + m.a14 * o.a43;
    this.a14 = m.a11 * o.a14 + m.a12 * o.a24 + m.a13 * o.a34 + m.a14 * o.a44;

    this.a21 = m.a21 * o.a11 + m.a22 * o.a21 + m.a23 * o.a31 + m.a24 * o.a41;
    this.a22 = m.a21 * o.a12 + m.a22 * o.a22 + m.a23 * o.a32 + m.a24 * o.a42;
    this.a23 = m.a21 * o.a13 + m.a22 * o.a23 + m.a23 * o.a33 + m.a24 * o.a43;
    this.a24 = m.a21 * o.a14 + m.a22 * o.a24 + m.a23 * o.a34 + m.a24 * o.a44;

    this.a31 = m.a31 * o.a11 + m.a32 * o.a21 + m.a33 * o.a31 + m.a34 * o.a41;
    this.a32 = m.a31 * o.a12 + m.a32 * o.a22 + m.a33 * o.a32 + m.a34 * o.a42;
    this.a33 = m.a31 * o.a13 + m.a32 * o.a23 + m.a33 * o.a33 + m.a34 * o.a43;
    this.a34 = m.a31 * o.a14 + m.a32 * o.a24 + m.a33 * o.a34 + m.a34 * o.a44;

    this.a41 = m.a41 * o.a11 + m.a42 * o.a21 + m.a43 * o.a31 + m.a44 * o.a41;
    this.a42 = m.a41 * o.a12 + m.a42 * o.a22 + m.a43 * o.a32 + m.a44 * o.a42;
    this.a43 = m.a41 * o.a13 + m.a42 * o.a23 + m.a43 * o.a33 + m.a44 * o.a43;
    this.a44 = m.a41 * o.a14 + m.a42 * o.a24 + m.a43 * o.a34 + m.a44 * o.a44;
    return this;
  }

  /**
   * Like {@link Mat4.multiply}, but returns a new matrix and leaves this one unchanged.
   *
   * @param m The matrix to multiply by, on the right.
   * @returns A new matrix holding `this × m`.
   */
  multiplyNew(m: Mat4): Mat4 {
    return this.clone().multiply(m);
  }

  /**
   * Multiply every element, including the translation and `a44`, by a number in place.
   *
   * @param s The number to multiply by.
   * @returns This matrix, for chaining.
   */
  multiplyScalar(s: number): Mat4 {
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

  /**
   * Like {@link Mat4.multiplyScalar}, but returns a new matrix and leaves this one unchanged.
   *
   * @param s The number to multiply by.
   * @returns A new, scaled matrix.
   */
  multiplyScalarNew(s: number): Mat4 {
    return this.clone().multiplyScalar(s);
  }

  /**
   * An alias of {@link Mat4.multiplyScalar}: multiplies all 16 elements in
   * place. This is not a uniform scale transform, since it also scales the
   * translation and `a44`; use {@link Mat4.scaleByVec3} for that.
   *
   * @param s The number to multiply by.
   * @returns This matrix, for chaining.
   */
  scale(s: number): Mat4 {
    return this.multiplyScalar(s);
  }

  /**
   * Like {@link Mat4.scale}, but returns a new matrix and leaves this one unchanged.
   *
   * @param s The number to multiply by.
   * @returns A new, scaled matrix.
   */
  scaleNew(s: number): Mat4 {
    return this.multiplyScalarNew(s);
  }

  /**
   * Scale the matrix in place by a per-axis amount, multiplying the first,
   * second and third columns by `x`, `y` and `z`. This is `this × S`, so the
   * scale applies in the matrix's local space. The translation is unchanged.
   *
   * @param v The x, y and z scale factors.
   * @returns This matrix, for chaining.
   */
  scaleByVec3(v: Vec3Like): Mat4 {
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];
    const [x, y, z] = va;

    this.a11 *= x;
    this.a12 *= x;
    this.a13 *= x;
    this.a14 *= x;

    this.a21 *= y;
    this.a22 *= y;
    this.a23 *= y;
    this.a24 *= y;

    this.a31 *= z;
    this.a32 *= z;
    this.a33 *= z;
    this.a34 *= z;

    return this;
  }

  /**
   * Like {@link Mat4.scaleByVec3}, but returns a new matrix and leaves this one unchanged.
   *
   * @param v The x, y and z scale factors.
   * @returns A new, scaled matrix.
   */
  scaleByVec3New(v: Vec3Like): Mat4 {
    return this.clone().scaleByVec3(v);
  }

  /**
   * Add a vector to the translation (`a41`–`a43`) in place. Unlike
   * {@link Mat4.translate}, the offset is not rotated or scaled by the matrix.
   *
   * @param v The amount to add to the translation.
   * @returns This matrix, for chaining.
   */
  transform(v: Vec3Like): Mat4 {
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];

    this.a41 += va[0];
    this.a42 += va[1];
    this.a43 += va[2];

    return this;
  }

  /**
   * Like {@link Mat4.transform}, but returns a new matrix and leaves this one unchanged.
   *
   * @param v The amount to add to the translation.
   * @returns A new matrix with the offset translation.
   */
  transformNew(v: Vec3Like): Mat4 {
    return this.clone().transform(v);
  }

  /**
   * Set the translation (`a41`–`a43`) in place, leaving the other elements unchanged.
   *
   * @param v The new translation.
   * @returns This matrix, for chaining.
   */
  transformTo(v: Vec3Like): Mat4 {
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];

    this.a41 = va[0];
    this.a42 = va[1];
    this.a43 = va[2];

    return this;
  }
  /**
   * Like {@link Mat4.transformTo}, but returns a new matrix and leaves this
   * one unchanged.
   *
   * @param v The new translation.
   * @returns A new matrix.
   */
  transformToNew(v: Vec3Like): Mat4 {
    return this.clone().transformTo(v);
  }

  /**
   * Translate the matrix in place by `v` in its local space, so this becomes
   * `this × T(v)`. The offset is rotated and scaled by the existing matrix;
   * use {@link Mat4.transform} to offset in world space instead.
   *
   * @param v The amount to translate by.
   * @returns This matrix, for chaining.
   */
  translate(v: Vec3Like): Mat4 {
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];
    const v0 = va[0];
    const v1 = va[1];
    const v2 = va[2];

    const a11 = this.a11;
    const a12 = this.a12;
    const a13 = this.a13;
    const a14 = this.a14;

    const a21 = this.a21;
    const a22 = this.a22;
    const a23 = this.a23;
    const a24 = this.a24;

    const a31 = this.a31;
    const a32 = this.a32;
    const a33 = this.a33;
    const a34 = this.a34;

    const a41 = this.a41;
    const a42 = this.a42;
    const a43 = this.a43;
    const a44 = this.a44;

    this.a41 = a11 * v0 + a21 * v1 + a31 * v2 + a41;
    this.a42 = a12 * v0 + a22 * v1 + a32 * v2 + a42;
    this.a43 = a13 * v0 + a23 * v1 + a33 * v2 + a43;
    this.a44 = a14 * v0 + a24 * v1 + a34 * v2 + a44;

    return this;
  }
  /**
   * Like {@link Mat4.translate}, but returns a new matrix and leaves this one unchanged.
   *
   * @param v The amount to translate by.
   * @returns A new, translated matrix.
   */
  translateNew(v: Vec3Like): Mat4 {
    return this.clone().translate(v);
  }

  /**
   * Rotate the matrix in place around an axis, so this becomes `this × R`. The
   * rotation is right-handed (counter-clockwise when looking down the axis
   * towards the origin) and the translation is unchanged.
   *
   * @param r The angle, in radians.
   * @param axis The axis to rotate around. It is normalised for you; if its length is close to zero the matrix is left unchanged.
   * @returns This matrix, for chaining.
   */
  rotate(r: number, axis: Vec3Like): Mat4 {
    const aa = Array.isArray(axis) ? axis : [axis.x, axis.y, axis.z];
    let l = Math.hypot(aa[0], aa[1], aa[2]);
    if (l < EPSILON) return this;

    l = 1 / l;
    const x = aa[0] * l,
      y = aa[1] * l,
      z = aa[2] * l,
      s = Math.sin(r),
      c = Math.cos(r),
      t = 1 - c,
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

  /**
   * Like {@link Mat4.rotate}, but returns a new matrix and leaves this one unchanged.
   *
   * @param r The angle, in radians.
   * @param axis The axis to rotate around.
   * @returns A new, rotated matrix.
   */
  rotateNew(r: number, axis: Vec3Like): Mat4 {
    return this.clone().rotate(r, axis);
  }

  /**
   * Invert the matrix in place. If the matrix is singular (its determinant is
   * 0) it cannot be inverted, and is left unchanged; this never returns `null`.
   *
   * @returns This matrix, for chaining.
   */
  invert(): Mat4 {
    const c = this.clone();

    const {
      f: { b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11 },
      determinant,
    } = this.determinantFunction;

    // If we don't have a determinant this function should fail silently and just return the unmodified array
    if (determinant) {
      const det = 1.0 / determinant;

      this.a11 = (c.a22 * b11 - c.a23 * b10 + c.a24 * b09) * det;
      this.a12 = (c.a13 * b10 - c.a12 * b11 - c.a14 * b09) * det;
      this.a13 = (c.a42 * b05 - c.a43 * b04 + c.a44 * b03) * det;
      this.a14 = (c.a33 * b04 - c.a32 * b05 - c.a34 * b03) * det;
      this.a21 = (c.a23 * b08 - c.a21 * b11 - c.a24 * b07) * det;
      this.a22 = (c.a11 * b11 - c.a13 * b08 + c.a14 * b07) * det;
      this.a23 = (c.a43 * b02 - c.a41 * b05 - c.a44 * b01) * det;
      this.a24 = (c.a31 * b05 - c.a33 * b02 + c.a34 * b01) * det;
      this.a31 = (c.a21 * b10 - c.a22 * b08 + c.a24 * b06) * det;
      this.a32 = (c.a12 * b08 - c.a11 * b10 - c.a14 * b06) * det;
      this.a33 = (c.a41 * b04 - c.a42 * b02 + c.a44 * b00) * det;
      this.a34 = (c.a32 * b02 - c.a31 * b04 - c.a34 * b00) * det;
      this.a41 = (c.a22 * b07 - c.a21 * b09 - c.a23 * b06) * det;
      this.a42 = (c.a11 * b09 - c.a12 * b07 + c.a13 * b06) * det;
      this.a43 = (c.a42 * b01 - c.a41 * b03 - c.a43 * b00) * det;
      this.a44 = (c.a31 * b03 - c.a32 * b01 + c.a33 * b00) * det;
    }

    return this;
  }

  /**
   * Like {@link Mat4.invert}, but returns a new matrix and leaves this one
   * unchanged. A singular matrix gives an unchanged copy.
   *
   * @returns A new, inverted matrix.
   */
  invertNew(): Mat4 {
    return this.clone().invert();
  }

  /**
   * A readable string of the elements, one column per line in column-major
   * order, with surrounding newlines and indentation.
   *
   * @returns The elements as a string.
   */
  toString(): string {
    return `
      ${this.a11}, ${this.a12}, ${this.a13}, ${this.a14},
      ${this.a21}, ${this.a22}, ${this.a23}, ${this.a24},
      ${this.a31}, ${this.a32}, ${this.a33}, ${this.a34},
      ${this.a41}, ${this.a42}, ${this.a43}, ${this.a44}
    `;
  }

  // Element accessors. aCR is column C, row R.

  #a11: number = 0;
  /** Set the element in column 1, row 1. Throws a `TypeError` if `v` is not a number. */
  set a11(v: number) {
    if (typeof v == "number") {
      this.#a11 = v;
    } else {
      throw new TypeError("a11 should be a number");
    }
  }
  /** The element in column 1, row 1. Reads as 0 if the stored value is `NaN`. */
  get a11() {
    return this.#a11 || 0;
  }

  #a12: number = 0;
  /** Set the element in column 1, row 2. Throws a `TypeError` if `v` is not a number. */
  set a12(v: number) {
    if (typeof v == "number") {
      this.#a12 = v;
    } else {
      throw new TypeError("a12 should be a number");
    }
  }
  /** The element in column 1, row 2. Reads as 0 if the stored value is `NaN`. */
  get a12() {
    return this.#a12 || 0;
  }

  #a13: number = 0;
  /** Set the element in column 1, row 3. Throws a `TypeError` if `v` is not a number. */
  set a13(v: number) {
    if (typeof v == "number") {
      this.#a13 = v;
    } else {
      throw new TypeError("a13 should be a number");
    }
  }
  /** The element in column 1, row 3. Reads as 0 if the stored value is `NaN`. */
  get a13() {
    return this.#a13 || 0;
  }

  #a14: number = 0;
  /** Set the element in column 1, row 4. Throws a `TypeError` if `v` is not a number. */
  set a14(v: number) {
    if (typeof v == "number") {
      this.#a14 = v;
    } else {
      throw new TypeError("a14 should be a number");
    }
  }
  /** The element in column 1, row 4. Reads as 0 if the stored value is `NaN`. */
  get a14() {
    return this.#a14 || 0;
  }

  #a21: number = 0;
  /** Set the element in column 2, row 1. Throws a `TypeError` if `v` is not a number. */
  set a21(v: number) {
    if (typeof v == "number") {
      this.#a21 = v;
    } else {
      throw new TypeError("a21 should be a number");
    }
  }
  /** The element in column 2, row 1. Reads as 0 if the stored value is `NaN`. */
  get a21() {
    return this.#a21 || 0;
  }

  #a22: number = 0;
  /** Set the element in column 2, row 2. Throws a `TypeError` if `v` is not a number. */
  set a22(v: number) {
    if (typeof v == "number") {
      this.#a22 = v;
    } else {
      throw new TypeError("a22 should be a number");
    }
  }
  /** The element in column 2, row 2. Reads as 0 if the stored value is `NaN`. */
  get a22() {
    return this.#a22 || 0;
  }

  #a23: number = 0;
  /** Set the element in column 2, row 3. Throws a `TypeError` if `v` is not a number. */
  set a23(v: number) {
    if (typeof v == "number") {
      this.#a23 = v;
    } else {
      throw new TypeError("a23 should be a number");
    }
  }
  /** The element in column 2, row 3. Reads as 0 if the stored value is `NaN`. */
  get a23() {
    return this.#a23 || 0;
  }

  #a24: number = 0;
  /** Set the element in column 2, row 4. Throws a `TypeError` if `v` is not a number. */
  set a24(v: number) {
    if (typeof v == "number") {
      this.#a24 = v;
    } else {
      throw new TypeError("a24 should be a number");
    }
  }
  /** The element in column 2, row 4. Reads as 0 if the stored value is `NaN`. */
  get a24() {
    return this.#a24 || 0;
  }

  #a31: number = 0;
  /** Set the element in column 3, row 1. Throws a `TypeError` if `v` is not a number. */
  set a31(v: number) {
    if (typeof v == "number") {
      this.#a31 = v;
    } else {
      throw new TypeError("a31 should be a number");
    }
  }
  /** The element in column 3, row 1. Reads as 0 if the stored value is `NaN`. */
  get a31() {
    return this.#a31 || 0;
  }

  #a32: number = 0;
  /** Set the element in column 3, row 2. Throws a `TypeError` if `v` is not a number. */
  set a32(v: number) {
    if (typeof v == "number") {
      this.#a32 = v;
    } else {
      throw new TypeError("a32 should be a number");
    }
  }
  /** The element in column 3, row 2. Reads as 0 if the stored value is `NaN`. */
  get a32() {
    return this.#a32 || 0;
  }

  #a33: number = 0;
  /** Set the element in column 3, row 3. Throws a `TypeError` if `v` is not a number. */
  set a33(v: number) {
    if (typeof v == "number") {
      this.#a33 = v;
    } else {
      throw new TypeError("a33 should be a number");
    }
  }
  /** The element in column 3, row 3. Reads as 0 if the stored value is `NaN`. */
  get a33() {
    return this.#a33 || 0;
  }

  #a34: number = 0;
  /** Set the element in column 3, row 4. Throws a `TypeError` if `v` is not a number. */
  set a34(v: number) {
    if (typeof v == "number") {
      this.#a34 = v;
    } else {
      throw new TypeError("a34 should be a number");
    }
  }
  /** The element in column 3, row 4. Reads as 0 if the stored value is `NaN`. */
  get a34() {
    return this.#a34 || 0;
  }

  #a41: number = 0;
  /** Set the element in column 4, row 1. The x translation. Throws a `TypeError` if `v` is not a number. */
  set a41(v: number) {
    if (typeof v == "number") {
      this.#a41 = v;
    } else {
      throw new TypeError("a41 should be a number");
    }
  }
  /** The element in column 4, row 1. The x translation. Reads as 0 if the stored value is `NaN`. */
  get a41() {
    return this.#a41 || 0;
  }

  #a42: number = 0;
  /** Set the element in column 4, row 2. The y translation. Throws a `TypeError` if `v` is not a number. */
  set a42(v: number) {
    if (typeof v == "number") {
      this.#a42 = v;
    } else {
      throw new TypeError("a42 should be a number");
    }
  }
  /** The element in column 4, row 2. The y translation. Reads as 0 if the stored value is `NaN`. */
  get a42() {
    return this.#a42 || 0;
  }

  #a43: number = 0;
  /** Set the element in column 4, row 3. The z translation. Throws a `TypeError` if `v` is not a number. */
  set a43(v: number) {
    if (typeof v == "number") {
      this.#a43 = v;
    } else {
      throw new TypeError("a43 should be a number");
    }
  }
  /** The element in column 4, row 3. The z translation. Reads as 0 if the stored value is `NaN`. */
  get a43() {
    return this.#a43 || 0;
  }

  #a44: number = 0;
  /** Set the element in column 4, row 4. Throws a `TypeError` if `v` is not a number. */
  set a44(v: number) {
    if (typeof v == "number") {
      this.#a44 = v;
    } else {
      throw new TypeError("a44 should be a number");
    }
  }
  /** The element in column 4, row 4. Reads as 0 if the stored value is `NaN`. */
  get a44() {
    return this.#a44 || 0;
  }

  /** The Frobenius norm: the square root of the sum of the squares of all 16 elements. */
  get frobeniusnorm(): number {
    return Math.hypot(...this.array);
  }

  /** The translation (`a41`, `a42`, `a43`), as a new {@link Vec3}. */
  get translation(): Vec3 {
    return new Vec3(this.a41, this.a42, this.a43);
  }

  /**
   * The scale along each axis, as a new {@link Vec3}: the lengths of the first,
   * second and third columns. Assumes there is no shear; values are always
   * positive, so a negative scale (a mirror) is not recovered.
   */
  get scaling(): Vec3 {
    return new Vec3(
      Math.hypot(this.a11, this.a12, this.a13),
      Math.hypot(this.a21, this.a22, this.a23),
      Math.hypot(this.a31, this.a32, this.a33)
    );
  }

  /**
   * The rotation, as a new {@link Quat}, found by dividing each of the first
   * three columns by its length ({@link Mat4.scaling}). Works for any
   * positive scale, uniform or not, as long as there is no shear.
   */
  get rotation(): Quat {
    const scale = this.scaling.inverse();

    const sm11 = this.a11 * scale.x;
    const sm12 = this.a12 * scale.x;
    const sm13 = this.a13 * scale.x;

    const sm21 = this.a21 * scale.y;
    const sm22 = this.a22 * scale.y;
    const sm23 = this.a23 * scale.y;

    const sm31 = this.a31 * scale.z;
    const sm32 = this.a32 * scale.z;
    const sm33 = this.a33 * scale.z;

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
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
      return new Quat(
        0.25 * S,
        (sm12 + sm21) / S,
        (sm31 + sm13) / S,
        (sm23 - sm32) / S
      );
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
      return new Quat(
        (sm12 + sm21) / S,
        0.25 * S,
        (sm23 + sm32) / S,
        (sm31 - sm13) / S
      );
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
      return new Quat(
        (sm31 + sm13) / S,
        (sm23 + sm32) / S,
        0.25 * S,
        (sm12 - sm21) / S
      );
    }
  }

  /**
   * The determinant of the matrix, along with the twelve 2×2 sub-determinants
   * (`b00`–`b11`) that {@link Mat4.invert} reuses. Prefer {@link Mat4.determinant}
   * unless you need the intermediate values.
   */
  get determinantFunction(): Mat4DeterminantFunction {
    let b00 = this.a11 * this.a22 - this.a12 * this.a21;
    let b01 = this.a11 * this.a23 - this.a13 * this.a21;
    let b02 = this.a11 * this.a24 - this.a14 * this.a21;
    let b03 = this.a12 * this.a23 - this.a13 * this.a22;
    let b04 = this.a12 * this.a24 - this.a14 * this.a22;
    let b05 = this.a13 * this.a24 - this.a14 * this.a23;
    let b06 = this.a31 * this.a42 - this.a32 * this.a41;
    let b07 = this.a31 * this.a43 - this.a33 * this.a41;
    let b08 = this.a31 * this.a44 - this.a34 * this.a41;
    let b09 = this.a32 * this.a43 - this.a33 * this.a42;
    let b10 = this.a32 * this.a44 - this.a34 * this.a42;
    let b11 = this.a33 * this.a44 - this.a34 * this.a43;
    // Calculate the determinant
    return {
      f: { b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11 },
      determinant:
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06,
    };
  }

  /** The determinant of the matrix. */
  get determinant(): number {
    return this.determinantFunction.determinant;
  }

  /** The 16 elements as a new array, in column-major order, ready to pass to WebGL. */
  get array(): number[] {
    return [
      this.a11,
      this.a12,
      this.a13,
      this.a14,
      this.a21,
      this.a22,
      this.a23,
      this.a24,
      this.a31,
      this.a32,
      this.a33,
      this.a34,
      this.a41,
      this.a42,
      this.a43,
      this.a44,
    ];
  }

  /**
   * Create a rotation matrix around an axis. See {@link Mat4.rotate}.
   *
   * @param r The angle, in radians.
   * @param axis The axis to rotate around, as a Vec3 or `[x, y, z]` array. It is normalised for you; if its length is close to zero you get the identity matrix.
   * @returns A new matrix.
   */
  static fromRotation(r: number, axis: Vec3Like): Mat4 {
    return new Mat4().rotate(r, axis);
  }

  /**
   * Create a matrix that rotates around the x axis (right-handed).
   *
   * @param r The angle, in radians.
   * @returns A new matrix.
   */
  static fromXRotation(r: number) {
    const s = Math.sin(r),
      c = Math.cos(r);

    return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
  }

  /**
   * Create a matrix that rotates around the y axis (right-handed).
   *
   * @param r The angle, in radians.
   * @returns A new matrix.
   */
  static fromYRotation(r: number) {
    const s = Math.sin(r),
      c = Math.cos(r);

    return new Mat4(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
  }

  /**
   * Create a matrix that rotates around the z axis (right-handed).
   *
   * @param r The angle, in radians.
   * @returns A new matrix.
   */
  static fromZRotation(r: number) {
    const s = Math.sin(r),
      c = Math.cos(r);

    return new Mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  /**
   * Create a scale matrix.
   *
   * @param v The x, y and z scale factors.
   * @returns A new matrix.
   */
  static fromScalingVec3(v: Vec3Like): Mat4 {
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];
    return new Mat4(va[0], 0, 0, 0, 0, va[1], 0, 0, 0, 0, va[2], 0, 0, 0, 0, 1);
  }

  /**
   * Create a translation matrix.
   *
   * @param v The translation.
   * @returns A new matrix.
   */
  static fromTranslatingVec3(v: Vec3Like): Mat4 {
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];
    return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, va[0], va[1], va[2], 1);
  }

  /**
   * Create a rotation matrix from a quaternion. The quaternion should be
   * normalised; it is not normalised for you.
   *
   * @param q The rotation, ordered x, y, z, w.
   * @returns A new matrix.
   */
  static fromQuat(q: QuatLike): Mat4 {
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
      0,
      0,
      0,
      1
    );
  }

  /**
   * Create a matrix from a rotation, translation and scale. The result is
   * `T × R × S`: points are scaled, then rotated, then translated. It gives the
   * same result as the following, but faster:
   *
   * ```ts
   * Mat4.fromTranslatingVec3(v)
   *   .multiply(Mat4.fromQuat(q))
   *   .scaleByVec3(s);
   * ```
   *
   * @param q The rotation, as a normalised quaternion ordered x, y, z, w.
   * @param v The translation.
   * @param s The x, y and z scale factors.
   * @returns A new matrix.
   */
  static fromRotationTranslationScale(q: QuatLike, v: Vec3Like, s: Vec3Like): Mat4 {
    const qa = Array.isArray(q) ? q : [q.x, q.y, q.z, q.w];
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];
    const sa = Array.isArray(s) ? s : [s.x, s.y, s.z];

    const x2 = qa[0] + qa[0],
      y2 = qa[1] + qa[1],
      z2 = qa[2] + qa[2];

    const xx = qa[0] * x2,
      xy = qa[0] * y2,
      xz = qa[0] * z2,
      yy = qa[1] * y2,
      yz = qa[1] * z2,
      zz = qa[2] * z2,
      wx = qa[3] * x2,
      wy = qa[3] * y2,
      wz = qa[3] * z2,
      sx = sa[0],
      sy = sa[1],
      sz = sa[2];

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
      va[0],
      va[1],
      va[2],
      1
    );
  }

  /**
   * Like {@link Mat4.fromRotationTranslationScale}, but rotates and scales
   * around the point `o` rather than the origin. The result is
   * `T(v) × T(o) × R × S × T(-o)`.
   *
   * @param q The rotation, as a normalised quaternion ordered x, y, z, w.
   * @param v The translation.
   * @param s The x, y and z scale factors.
   * @param o The point to rotate and scale around.
   * @returns A new matrix.
   */
  static fromRotationTranslationScaleOrigin(q: QuatLike, v: Vec3Like, s: Vec3Like, o: Vec3Like): Mat4 {
    const qa = Array.isArray(q) ? q : [q.x, q.y, q.z, q.w];
    const va = Array.isArray(v) ? v : [v.x, v.y, v.z];
    const sa = Array.isArray(s) ? s : [s.x, s.y, s.z];
    const oa = Array.isArray(o) ? o : [o.x, o.y, o.z];

    const x2 = qa[0] + qa[0],
      y2 = qa[1] + qa[1],
      z2 = qa[2] + qa[2];

    const xx = qa[0] * x2,
      xy = qa[0] * y2,
      xz = qa[0] * z2,
      yy = qa[1] * y2,
      yz = qa[1] * z2,
      zz = qa[2] * z2,
      wx = qa[3] * x2,
      wy = qa[3] * y2,
      wz = qa[3] * z2,
      sx = sa[0],
      sy = sa[1],
      sz = sa[2],
      ox = oa[0],
      oy = oa[1],
      oz = oa[2];

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
      va[0] + ox - (out0 * ox + out4 * oy + out8 * oz),
      va[1] + oy - (out1 * ox + out5 * oy + out9 * oz),
      va[2] + oz - (out2 * ox + out6 * oy + out10 * oz),
      1
    );
  }

  /**
   * Create a perspective projection matrix from the bounds of a frustum, as
   * `glFrustum` does. Right-handed: the camera looks down -z. Maps depth to
   * WebGL clip space, where z runs from -1 (near) to 1 (far).
   *
   * @param left The left edge of the near plane.
   * @param right The right edge of the near plane.
   * @param bottom The bottom edge of the near plane.
   * @param top The top edge of the near plane.
   * @param near The distance to the near plane. Must be positive.
   * @param far The distance to the far plane.
   * @returns A new matrix.
   */
  static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    const rl = 1 / (right - left),
      tb = 1 / (top - bottom),
      nf = 1 / (near - far);

    return new Mat4(
      near * 2 * rl,
      0,
      0,
      0,

      0,
      near * 2 * tb,
      0,
      0,

      (right + left) * rl,
      (top + bottom) * tb,
      (far + near) * nf,
      -1,

      0,
      0,
      far * near * 2 * nf,
      0
    );
  }

  /**
   * Create a perspective projection matrix. Right-handed: the camera looks
   * down -z. Maps depth to WebGL clip space, where z runs from -1 (near) to
   * 1 (far).
   *
   * @param fovy The vertical field of view, in radians.
   * @param aspect The aspect ratio, usually the viewport width divided by its height.
   * @param near The distance to the near plane. Must be positive.
   * @param far The distance to the far plane. Pass `Infinity` for an infinite far plane.
   * @returns A new matrix.
   */
  static perspective(fovy: number, aspect: number, near: number, far: number) {
    const f = 1.0 / Math.tan(fovy / 2);
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
      f / aspect,
      0,
      0,
      0,

      0,
      f,
      0,
      0,

      0,
      0,
      a33,
      -1,

      0,
      0,
      a43,
      0
    );

    return out;
  }

  /**
   * Create an orthographic projection matrix, as `glOrtho` does. Right-handed:
   * the camera looks down -z. Maps the box to WebGL clip space, where x, y and
   * z all run from -1 to 1.
   *
   * @param left The left edge of the view box.
   * @param right The right edge of the view box.
   * @param bottom The bottom edge of the view box.
   * @param top The top edge of the view box.
   * @param near The distance to the near plane.
   * @param far The distance to the far plane.
   * @returns A new matrix.
   */
  static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    const lr = 1 / (left - right),
      bt = 1 / (bottom - top),
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
   * Create a view matrix for a camera at `eye` looking at `center`. This is
   * the inverse of the camera's world transform, for use as a view matrix;
   * the camera looks down its -z axis. To point an object at a target, use
   * {@link Mat4.targetTo} instead.
   *
   * If `eye` and `center` are (almost) the same point, returns the identity
   * matrix. If `up` is parallel to the view direction, the x and y axes of the
   * result are zero.
   *
   * @param eye The position of the camera.
   * @param center The point the camera looks at.
   * @param up The up direction. Does not need to be normalised.
   * @returns A new matrix.
   */
  static lookAt(eye: Vec3Like, center: Vec3Like, up: Vec3Like) {
    const ea = Array.isArray(eye) ? eye : [eye.x, eye.y, eye.z];
    const ca = Array.isArray(center) ? center : [center.x, center.y, center.z];
    const ua = Array.isArray(up) ? up : [up.x, up.y, up.z];
    const e = new Vec3(...ea),
      c = new Vec3(...ca),
      u = new Vec3(...ua);

    if (
      Math.abs(e.x - c.x) < EPSILON &&
      Math.abs(e.y - c.y) < EPSILON &&
      Math.abs(e.z - c.z) < EPSILON
    ) {
      return new Mat4();
    }

    const off = e.subtractNew(c);
    let l = 1 / Math.hypot(off.x, off.y, off.z);
    off.x *= l;
    off.y *= l;
    off.z *= l;

    const or = new Vec3(
      u.y * off.z - u.z * off.y,
      u.z * off.x - u.x * off.z,
      u.x * off.y - u.y * off.x
    );
    l = Math.hypot(or.x, or.y, or.z);
    if (!l) {
      or.reset(0, 0, 0);
    } else {
      l = 1 / l;
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
    if (!l) {
      tn.reset(0, 0, 0);
    } else {
      l = 1 / l;
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

  /**
   * Create a world transform that places an object at `eye` with its -z axis
   * pointing at `target` and its y axis towards `up`. This is the inverse of
   * {@link Mat4.lookAt}.
   *
   * If `eye` and `target` are the same point, the object faces down -z. If
   * `up` is parallel to the view direction, it is nudged slightly so the
   * result is still valid.
   *
   * @param eye The position of the object.
   * @param target The point the object faces.
   * @param up The up direction. Does not need to be normalised.
   * @returns A new matrix.
   */
  static targetTo(eye: Vec3Like, target: Vec3Like, up: Vec3Like) {
    const ea = Array.isArray(eye) ? eye : [eye.x, eye.y, eye.z];
    const ta = Array.isArray(target) ? target : [target.x, target.y, target.z];
    const ua = Array.isArray(up) ? up : [up.x, up.y, up.z];
    const e = new Vec3(...ea),
      c = new Vec3(...ta),
      u = new Vec3(...ua);

    const off = e.subtractNew(c);
    let l = off.lengthSquared;
    if (l > 0) {
      l = 1 / Math.sqrt(l);
      off.x *= l;
      off.y *= l;
      off.z *= l;
    } else {
      off.z = 1;
    }

    const or = new Vec3(
      u.y * off.z - u.z * off.y,
      u.z * off.x - u.x * off.z,
      u.x * off.y - u.y * off.x
    );
    l = or.lengthSquared;
    if (l === 0) {
      if (u.z) u.x += 1e-6;
      else if (u.y) u.z += 1e-6;
      else u.y += 1e-6;
      or.reset(
        u.y * off.z - u.z * off.y,
        u.z * off.x - u.x * off.z,
        u.x * off.y - u.y * off.x
      );
      l = or.lengthSquared;
    }

    l = 1 / Math.sqrt(l);
    or.x *= l;
    or.y *= l;
    or.z *= l;

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

  /** Iterate over the elements in column-major order, so the matrix can be spread: `[...m]`. */
  [Symbol.iterator](): Iterator<number> {
    return this.array[Symbol.iterator]();
  }
}

export { Mat4 };
