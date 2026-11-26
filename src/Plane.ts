/**
 * An infinite plane in 3D space, stored as a normal and a constant so that
 * points on the plane satisfy `normal · p + constant = 0`. Imported
 * separately from the rest of wtc-math:
 *
 * ```ts
 * import { Plane } from 'wtc-math/plane'
 * ```
 *
 * @module wtc-math/plane
 */
import { Vec3 } from "./Vec3.js";
import type { Vec3Like } from "./types.js";

/**
 * An infinite plane defined by `normal · p + constant = 0`.
 *
 * The constructor normalises the normal, so distances are true distances.
 * If you assign a non-unit `normal` afterwards, call {@link Plane.normalize}.
 */
class Plane {
  /** The plane's normal. Points on its side have a positive signed distance. */
  normal: Vec3;
  /** The plane constant: the signed distance from the plane to the world origin, for a unit normal. */
  constant: number;

  /**
   * Creates a plane from a normal and constant, so that points on it satisfy
   * `normal · p + constant = 0`. The normal is scaled to unit length and the
   * constant by the same factor, which keeps the plane in place:
   * `new Plane([0, 2, 0], -4)` is the plane y = 2, stored as `(0, 1, 0)` and
   * `-2`.
   *
   * @param normal The plane normal. Defaults to `(0, 1, 0)`.
   * @param constant The plane constant. Defaults to `0`, a plane through the origin.
   */
  constructor(normal: Vec3Like = new Vec3(0, 1, 0), constant = 0) {
    this.normal = Vec3.interpolate(normal);
    this.constant = constant;
    this.normalize();
  }

  /**
   * Copies this plane.
   *
   * @returns A new plane with a copy of the normal and the same constant.
   */
  clone(): Plane {
    return new Plane(this.normal.clone(), this.constant);
  }

  /**
   * Scales the normal to unit length and the constant by the same factor, so
   * the plane stays in place. Modifies this plane. A zero normal is left
   * unchanged.
   *
   * @returns This plane.
   */
  normalize(): Plane {
    const length = this.normal.length;
    if (length === 0) return this;
    const inv = 1 / length;
    this.normal.multiplyScalar(inv);
    this.constant *= inv;
    return this;
  }

  /**
   * Flips the plane to face the other way by negating the normal and the
   * constant. Modifies this plane.
   *
   * @returns This plane.
   */
  negate(): Plane {
    this.normal.negate();
    this.constant = -this.constant;
    return this;
  }

  /**
   * Signed distance from the plane to a point: positive on the normal side,
   * negative on the other, zero on the plane.
   *
   * @param point The point to measure.
   * @returns `normal · point + constant`.
   */
  distanceTo(point: Vec3Like): number {
    const p = Vec3.interpolate(point);
    return this.normal.dot(p) + this.constant;
  }

  /**
   * Projects a point onto the plane surface along the normal.
   *
   * @param point The point to project.
   * @returns A new {@link Vec3} on the plane.
   */
  projectPoint(point: Vec3Like): Vec3 {
    const p = Vec3.interpolate(point);
    return p.subtractNew(this.normal.multiplyScalarNew(this.distanceTo(p)));
  }

  /**
   * Finds where the line segment from `start` to `end` crosses the plane.
   * Only hits within the segment count.
   *
   * @param start The start of the segment.
   * @param end The end of the segment.
   * @returns A new {@link Vec3} at the crossing, or `null` if the segment does
   * not reach the plane or runs parallel to it.
   */
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

  /**
   * Creates a plane with the given normal passing through a point. The normal
   * is normalised.
   *
   * @param normal The plane normal.
   * @param point Any point on the plane.
   * @returns A new plane.
   */
  static fromNormalAndPoint(normal: Vec3Like, point: Vec3Like): Plane {
    const n = Vec3.interpolate(normal).normalise();
    const p = Vec3.interpolate(point);
    return new Plane(n, -n.dot(p));
  }

  /**
   * Creates the plane through three points. The unit normal is
   * `(b − a) × (c − a)`, so it faces the side from which `a`, `b`, `c` run
   * anticlockwise.
   *
   * @param a The first point.
   * @param b The second point.
   * @param c The third point.
   * @returns A new plane.
   */
  static fromPoints(a: Vec3Like, b: Vec3Like, c: Vec3Like): Plane {
    const va = Vec3.interpolate(a);
    const vb = Vec3.interpolate(b);
    const vc = Vec3.interpolate(c);
    const normal = vb.subtractNew(va).cross(vc.subtractNew(va)).normalise();
    return new Plane(normal, -normal.dot(va));
  }
}

export { Plane };
