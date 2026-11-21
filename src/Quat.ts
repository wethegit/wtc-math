import { Mat3 } from "./Mat3.js";
import { Vec3 } from "./Vec3.js";
import { Vec4, V4Q } from "./Vec4.js";
import type { Vec3Like } from "./types.js";

const identity: number[] = [0, 0, 0, 1];

const identToIndex = function (v: string): number {
  return ["x", "y", "z", "w"].indexOf(v);
};

const orDefault = function (v: any, ident: string): number {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

/**
 * A quaternion for representing 3D rotations, stored as x, y, z and w where
 * w is the scalar (real) part.
 *
 * Quat extends {@link Vec4}, so it inherits the component-wise vector methods
 * (`add`, `scale`, `normalise`, swizzles and so on). Multiplication, the axis
 * rotations, `dot`, `clone` and `reset` are overridden with quaternion
 * behaviour. Note that the inherited `inverse` is the component-wise
 * reciprocal; use {@link Quat.invert} for the quaternion inverse.
 */
class Quat extends Vec4 implements V4Q {
  /**
   * Create a new quaternion. Missing or `NaN` components default to the
   * identity quaternion `(0, 0, 0, 1)`, so `new Quat()` is the identity.
   *
   * @param args The x, y, z and w components, in that order.
   */
  constructor(...args: number[]) {
    super(...args);
    this.reset(...args);
  }

  /**
   * Set the components in place. Missing or `NaN` components are taken from
   * the identity quaternion: x, y and z become 0 and w becomes 1.
   *
   * @param args The x, y, z and w components, in that order.
   * @returns This quaternion, for chaining.
   */
  reset(...args: number[]): V4Q {
    let [x, y, z, w] = args;
    this.x = orDefault(x, "x");
    this.y = orDefault(y, "y");
    this.z = orDefault(z, "z");
    this.w = orDefault(w, "w");

    return this;
  }

  /**
   * Copy the x, y, z and w components of another quaternion or vector into
   * this one, in place.
   *
   * @param q The quaternion to copy from.
   * @returns This quaternion, for chaining.
   */
  resetToQuat(q: V4Q): Quat {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;

    return this;
  }

  /**
   * Create a copy of this quaternion.
   *
   * @returns A new Quat with the same components.
   */
  clone(): V4Q {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  /**
   * The components as a comma-separated string.
   *
   * @returns A string in the form `"x, y, z, w"`.
   */
  toString() {
    return `${this.x}, ${this.y}, ${this.z}, ${this.w}`;
  }

  /**
   * Multiply this quaternion by another (the Hamilton product `this × q`),
   * in place. The result applies the rotation `q` first, then this one.
   *
   * @param q The quaternion to multiply by, on the right.
   * @returns This quaternion, for chaining.
   */
  multiply(q: V4Q): V4Q {
    const a = this.clone();

    this.x = a.x * q.w + a.w * q.x + a.y * q.z - a.z * q.y;
    this.y = a.y * q.w + a.w * q.y + a.z * q.x - a.x * q.z;
    this.z = a.z * q.w + a.w * q.z + a.x * q.y - a.y * q.x;
    this.w = a.w * q.w - a.x * q.x - a.y * q.y - a.z * q.z;

    return this;
  }

  /**
   * Like `multiply`, but returns a new quaternion and leaves this one
   * unchanged.
   *
   * @param q The quaternion to multiply by, on the right.
   * @returns A new Quat holding `this × q`.
   */
  multiplyNew(q: V4Q): V4Q {
    return this.clone().multiply(q);
  }

  /**
   * Rotate this quaternion around its local X axis, in place. Equivalent to
   * multiplying on the right by a quaternion of `rad` radians about X.
   *
   * @param origin Ignored. Present to match the {@link Vec4.rotateX} signature.
   * @param rad The angle in radians.
   * @returns This quaternion, for chaining.
   */
  rotateX(origin: V4Q, rad: number): V4Q {
    rad *= 0.5;

    const a = this.clone();
    const s = Math.sin(rad),
      c = Math.cos(rad);

    this.x = a.x * c + a.w * s;
    this.y = a.y * c + a.z * s;
    this.z = a.z * c - a.y * s;
    this.w = a.w * c - a.x * s;

    return this;
  }

  /**
   * Rotate this quaternion around its local Y axis, in place. Equivalent to
   * multiplying on the right by a quaternion of `rad` radians about Y.
   *
   * @param origin Ignored. Present to match the {@link Vec4.rotateY} signature.
   * @param rad The angle in radians.
   * @returns This quaternion, for chaining.
   */
  rotateY(origin: V4Q, rad: number): V4Q {
    rad *= 0.5;

    const a = this.clone();
    const s = Math.sin(rad),
      c = Math.cos(rad);

    this.x = a.x * c - a.z * s;
    this.y = a.y * c + a.w * s;
    this.z = a.z * c + a.x * s;
    this.w = a.w * c - a.y * s;

    return this;
  }

  /**
   * Rotate this quaternion around its local Z axis, in place. Equivalent to
   * multiplying on the right by a quaternion of `rad` radians about Z.
   *
   * @param origin Ignored. Present to match the {@link Vec4.rotateZ} signature.
   * @param rad The angle in radians.
   * @returns This quaternion, for chaining.
   */
  rotateZ(origin: V4Q, rad: number): V4Q {
    rad *= 0.5;

    const a = this.clone();
    const s = Math.sin(rad),
      c = Math.cos(rad);

    this.x = a.x * c + a.y * s;
    this.y = a.y * c - a.x * s;
    this.z = a.z * c + a.w * s;
    this.w = a.w * c - a.z * s;

    return this;
  }

  /**
   * The dot product of this quaternion and another. For unit quaternions this
   * is the cosine of half the angle between the two rotations; its sign shows
   * whether they lie in the same hemisphere.
   *
   * @param q The other quaternion.
   * @returns The sum of the products of the matching components.
   */
  dot(q: V4Q): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  /**
   * Conjugate the quaternion in place by negating x, y and z. For a unit
   * quaternion this is the inverse rotation.
   *
   * @returns This quaternion, for chaining.
   */
  conjugate(): Quat {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  /**
   * Like `conjugate`, but returns a new quaternion and leaves this one
   * unchanged.
   *
   * @returns A new, conjugated Quat.
   */
  conjugateNew(): Quat {
    return (this.clone() as Quat).conjugate();
  }

  /**
   * Invert the quaternion in place: the conjugate divided by the squared
   * length. Works for quaternions that are not normalised. A zero quaternion
   * is left unchanged.
   *
   * @returns This quaternion, for chaining.
   */
  invert(): Quat {
    const dot = this.dot(this);
    if (dot === 0) return this;
    const inv = 1 / dot;
    this.x = -this.x * inv;
    this.y = -this.y * inv;
    this.z = -this.z * inv;
    this.w = this.w * inv;
    return this;
  }

  /**
   * Like `invert`, but returns a new quaternion and leaves this one unchanged.
   *
   * @returns A new, inverted Quat.
   */
  invertNew(): Quat {
    return (this.clone() as Quat).invert();
  }

  // Getters and setters

  /**
   * The w component a unit quaternion would have, given this one's x, y and z:
   * `sqrt(|1 - x² - y² - z²|)`. Always 0 or positive. Does not read or change
   * the stored w. Read-only.
   */
  get normalW(): number {
    return Math.sqrt(
      Math.abs(1.0 - this.x * this.x - this.y * this.y - this.z * this.z)
    );
  }

  // Static methods

  /**
   * Create an identity quaternion, `(0, 0, 0, 1)`, which represents no
   * rotation.
   *
   * @returns A new Quat.
   */
  static identity(): Quat {
    return new Quat(0, 0, 0, 1);
  }

  /**
   * Spherical linear interpolation between two quaternions. Takes the
   * shortest path: if the dot product is negative, `q2` is negated first.
   * When the quaternions are nearly equal (`1 - dot` at or below 1e-6) it
   * falls back to linear interpolation. `t` is not clamped, and the inputs
   * should be normalised; the result is not normalised afterwards.
   *
   * @param q1 The start rotation, returned when `t` is 0.
   * @param q2 The end rotation, returned (or its negation) when `t` is 1.
   * @param t The interpolation amount, usually from 0 to 1.
   * @returns A new Quat.
   */
  static slerp(q1: Quat, q2: Quat, t: number): Quat {
    let dot = q1.dot(q2);

    // Ensure shortest path by flipping q2 if dot is negative
    let x2 = q2.x, y2 = q2.y, z2 = q2.z, w2 = q2.w;
    if (dot < 0) {
      dot = -dot;
      x2 = -x2; y2 = -y2; z2 = -z2; w2 = -w2;
    }

    let scale0: number, scale1: number;
    if (1 - dot > 1e-6) {
      const theta = Math.acos(dot);
      const sinTheta = Math.sin(theta);
      scale0 = Math.sin((1 - t) * theta) / sinTheta;
      scale1 = Math.sin(t * theta) / sinTheta;
    } else {
      // Quaternions are very close — linear interpolation is safe
      scale0 = 1 - t;
      scale1 = t;
    }

    return new Quat(
      scale0 * q1.x + scale1 * x2,
      scale0 * q1.y + scale1 * y2,
      scale0 * q1.z + scale1 * z2,
      scale0 * q1.w + scale1 * w2
    );
  }

  /**
   * Create a quaternion that rotates by an angle around an axis. The result
   * is `(axis * sin(rad / 2), cos(rad / 2))` in x, y, z, w order. The axis is
   * not normalised for you: pass a unit vector to get a unit quaternion.
   *
   * @param axis The axis to rotate around, as a Vec3 or `[x, y, z]` array.
   * Should be normalised.
   * @param rad The angle in radians.
   * @returns A new Quat.
   */
  static fromAxisAngle(axis: Vec3, rad: number): Quat {
    axis = Vec3.interpolate(axis);
    rad *= 0.5;
    const s = Math.sin(rad);
    return new Quat(s * axis.x, s * axis.y, s * axis.z, Math.cos(rad));
  }

  /**
   * Create a quaternion from Euler angles in radians.
   *
   * The order string names the axes in the order the rotation matrices are
   * multiplied, matching three.js: `"XYZ"` gives `Rx × Ry × Rz`, which is an
   * intrinsic rotation about X, then the new Y, then the new Z (or extrinsic
   * Z, then Y, then X). Supported orders are `"XYZ"`, `"YXZ"`, `"ZXY"`,
   * `"ZYX"`, `"YZX"` and `"XZY"`; any other string returns the identity
   * quaternion.
   *
   * @param euler The angles around the X, Y and Z axes, in radians, as a Vec3
   * or `[x, y, z]` array.
   * @param order The rotation order.
   * @returns A new Quat.
   */
  static fromEuler(euler: Vec3Like, order: string = "YXZ"): Quat {
    const ea = Array.isArray(euler) ? euler : [euler.x, euler.y, euler.z];
    const out = new Quat();

    const sx = Math.sin(ea[0] * 0.5);
    const cx = Math.cos(ea[0] * 0.5);
    const sy = Math.sin(ea[1] * 0.5);
    const cy = Math.cos(ea[1] * 0.5);
    const sz = Math.sin(ea[2] * 0.5);
    const cz = Math.cos(ea[2] * 0.5);

    if (order === "XYZ") {
      out.x = sx * cy * cz + cx * sy * sz;
      out.y = cx * sy * cz - sx * cy * sz;
      out.z = cx * cy * sz + sx * sy * cz;
      out.w = cx * cy * cz - sx * sy * sz;
    } else if (order === "YXZ") {
      out.x = sx * cy * cz + cx * sy * sz;
      out.y = cx * sy * cz - sx * cy * sz;
      out.z = cx * cy * sz - sx * sy * cz;
      out.w = cx * cy * cz + sx * sy * sz;
    } else if (order === "ZXY") {
      out.x = sx * cy * cz - cx * sy * sz;
      out.y = cx * sy * cz + sx * cy * sz;
      out.z = cx * cy * sz + sx * sy * cz;
      out.w = cx * cy * cz - sx * sy * sz;
    } else if (order === "ZYX") {
      out.x = sx * cy * cz - cx * sy * sz;
      out.y = cx * sy * cz + sx * cy * sz;
      out.z = cx * cy * sz - sx * sy * cz;
      out.w = cx * cy * cz + sx * sy * sz;
    } else if (order === "YZX") {
      out.x = sx * cy * cz + cx * sy * sz;
      out.y = cx * sy * cz + sx * cy * sz;
      out.z = cx * cy * sz - sx * sy * cz;
      out.w = cx * cy * cz - sx * sy * sz;
    } else if (order === "XZY") {
      out.x = sx * cy * cz - cx * sy * sz;
      out.y = cx * sy * cz - sx * cy * sz;
      out.z = cx * cy * sz + sx * sy * cz;
      out.w = cx * cy * cz + sx * sy * sz;
    }

    return out;
  }
}

export { Quat };
