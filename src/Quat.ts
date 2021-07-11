import { Mat3 } from "./Mat3";
import { Vec3 } from "./Vec3";
import { Vec4, V4Q } from "./Vec4";

const identity: number[] = [0, 0, 0, 1];

const identToIndex = function (v: string): number {
  return ["x", "y", "z", "w"].indexOf(v);
};

const orDefault = function (v: any, ident: string): number {
  return isNaN(v) ? identity[identToIndex(ident)] : Number(v);
};

class Quat extends Vec4 implements V4Q {
  constructor(...args: number[]) {
    super(...args);
    this.reset(...args);
  }

  reset(...args: number[]): V4Q {
    let [x, y, z, w] = args;
    this.x = orDefault(x, "x");
    this.y = orDefault(y, "y");
    this.z = orDefault(z, "z");
    this.w = orDefault(w, "w");

    return this;
  }

  resetToQuat(q): Quat {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;

    return this;
  }

  clone(): V4Q {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  toString() {
    return `${this.x}, ${this.y}, ${this.z}, ${this.w}`;
  }

  multiply(q: V4Q): V4Q {
    const a = this.clone();

    this.x = a.x * q.w + a.w * q.x + a.y * q.z - a.z * q.y;
    this.y = a.y * q.w + a.w * q.y + a.z * q.x - a.x * q.z;
    this.z = a.z * q.w + a.w * q.z + a.x * q.y - a.y * q.x;
    this.w = a.w * q.w - a.x * q.x - a.y * q.y - a.z * q.z;

    return this;
  }

  multiplyNew(q: V4Q): V4Q {
    return this.clone().multiply(q);
  }

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
   * Getters and setters
   */

  // Gets the calculated W component of this quaternion.
  get normalW(): number {
    return Math.sqrt(
      Math.abs(1.0 - this.x * this.x - this.y * this.y - this.z * this.z)
    );
  }

  /**
   * Static methods
   */

  /**
   * Creates a quaternion from a given axis and rotation
   *
   * @static
   * @param {Vec3|Array} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {Quat}
   **/
  static fromAxisAngle(axis: Vec3, rad: number): Quat {
    axis = Vec3.interpolate(axis);
    rad *= 0.5;
    const s = Math.sin(rad);
    return new Quat(s * axis.x, s * axis.y, s * axis.z, Math.cos(rad));
  }

  static fromEuler(euler: any, order: string = "YXZ"): Quat | void {
    if (euler.array) euler = euler.array; // This just transforms the matrix to an array.
    if (euler instanceof Array && euler.length >= 3) {
      const out = new Quat();

      let sx = Math.sin(euler[0] * 0.5);
      let cx = Math.cos(euler[0] * 0.5);
      let sy = Math.sin(euler[1] * 0.5);
      let cy = Math.cos(euler[1] * 0.5);
      let sz = Math.sin(euler[2] * 0.5);
      let cz = Math.cos(euler[2] * 0.5);

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
}

export { Quat };
