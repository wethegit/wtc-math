import { Vec3 } from "./Vec3";
import type { Vec3Like } from "./types";

class Plane {
  normal: Vec3;
  constant: number;

  constructor(normal: Vec3Like = new Vec3(0, 1, 0), constant = 0) {
    this.normal = Vec3.interpolate(normal);
    this.constant = constant;
  }

  clone(): Plane {
    return new Plane(this.normal.clone(), this.constant);
  }

  normalize(): Plane {
    const inv = 1 / this.normal.length;
    this.normal.multiplyScalar(inv);
    this.constant *= inv;
    return this;
  }

  negate(): Plane {
    this.normal.negate();
    this.constant = -this.constant;
    return this;
  }

  // Signed distance — positive on the normal side, negative on the other
  distanceTo(point: Vec3Like): number {
    const p = Vec3.interpolate(point);
    return this.normal.dot(p) + this.constant;
  }

  // Projects a point onto the plane surface
  projectPoint(point: Vec3Like): Vec3 {
    const p = Vec3.interpolate(point);
    return p.subtractNew(this.normal.multiplyScalarNew(this.distanceTo(p)));
  }

  // Returns intersection point along the line segment [start, end], or null if none
  intersectLine(start: Vec3Like, end: Vec3Like): Vec3 | null {
    const s = Vec3.interpolate(start);
    const e = Vec3.interpolate(end);
    const d = e.subtractNew(s);
    const denom = this.normal.dot(d);
    if (Math.abs(denom) < 1e-6) return null;
    const t = -(this.normal.dot(s) + this.constant) / denom;
    if (t < 0 || t > 1) return null;
    return s.addNew(d.multiplyScalar(t));
  }

  static fromNormalAndPoint(normal: Vec3Like, point: Vec3Like): Plane {
    const n = Vec3.interpolate(normal).normalise();
    const p = Vec3.interpolate(point);
    return new Plane(n, -n.dot(p));
  }

  static fromPoints(a: Vec3Like, b: Vec3Like, c: Vec3Like): Plane {
    const va = Vec3.interpolate(a);
    const vb = Vec3.interpolate(b);
    const vc = Vec3.interpolate(c);
    const normal = vb.subtractNew(va).cross(vc.subtractNew(va)).normalise();
    return new Plane(normal, -normal.dot(va));
  }
}

export { Plane };
