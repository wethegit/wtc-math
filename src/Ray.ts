/**
 * A ray in 3D space, with intersection tests against planes, spheres and
 * axis-aligned boxes. Imported separately from the rest of wtc-math:
 *
 * ```ts
 * import { Ray } from 'wtc-math/ray'
 * ```
 *
 * @module wtc-math/ray
 */
import { Vec3 } from "./Vec3.js";
import type { Vec3Like } from "./types.js";
import { Plane } from "./Plane.js";

/**
 * A half-line starting at `origin` and extending forever along `direction`.
 * Intersection methods return the nearest hit point in front of the origin,
 * or `null` if there is none.
 */
class Ray {
  /** The point the ray starts from. */
  origin: Vec3;
  /** The unit direction the ray travels in. */
  direction: Vec3;

  /**
   * Creates a ray. The direction is normalised on construction.
   *
   * @param origin The start point. Defaults to `(0, 0, 0)`.
   * @param direction The direction of travel. Defaults to `(0, 0, -1)`.
   */
  constructor(
    origin: Vec3Like = new Vec3(0, 0, 0),
    direction: Vec3Like = new Vec3(0, 0, -1)
  ) {
    this.origin = Vec3.interpolate(origin);
    this.direction = Vec3.interpolate(direction).normalise();
  }

  /**
   * Copies this ray.
   *
   * @returns A new ray with copies of the origin and direction.
   */
  clone(): Ray {
    return new Ray(this.origin.clone(), this.direction.clone());
  }

  /**
   * Gets the point at distance `t` along the ray.
   *
   * @param t Distance from the origin. Negative values give points behind it.
   * @returns A new {@link Vec3}: `origin + direction * t`.
   */
  at(t: number): Vec3 {
    return this.origin.addNew(this.direction.multiplyScalarNew(t));
  }

  /**
   * Shortest distance from the ray to a point. Points behind the origin are
   * measured to the origin.
   *
   * @param point The point to measure.
   * @returns The distance.
   */
  distanceTo(point: Vec3Like): number {
    const p = Vec3.interpolate(point);
    const diff = p.subtractNew(this.origin);
    const t = Math.max(0, diff.dot(this.direction));
    return diff.subtractNew(this.direction.multiplyScalarNew(t)).length;
  }

  /**
   * Closest point on the ray to a given point. For points behind the origin
   * this is the origin.
   *
   * @param point The point to test.
   * @returns A new {@link Vec3} on the ray.
   */
  closestPoint(point: Vec3Like): Vec3 {
    const p = Vec3.interpolate(point);
    const t = Math.max(0, p.subtractNew(this.origin).dot(this.direction));
    return this.at(t);
  }

  /**
   * Intersects the ray with a plane.
   *
   * @param plane The plane to test.
   * @returns A new {@link Vec3} where the ray meets the plane, or `null` if
   * the ray is parallel to the plane or the plane is behind the origin.
   */
  intersectPlane(plane: Plane): Vec3 | null {
    const denom = plane.normal.dot(this.direction);
    if (Math.abs(denom) < 1e-6) return null;
    const t = -(plane.normal.dot(this.origin) + plane.constant) / denom;
    if (t < 0) return null;
    return this.at(t);
  }

  /**
   * Intersects the ray with a sphere. If the origin is inside the sphere,
   * returns the exit point.
   *
   * @param center The centre of the sphere.
   * @param radius The radius of the sphere.
   * @returns A new {@link Vec3} at the nearest hit in front of the origin, or
   * `null` if the ray misses or the sphere is behind it.
   */
  intersectSphere(center: Vec3Like, radius: number): Vec3 | null {
    const c = Vec3.interpolate(center);
    const oc = this.origin.subtractNew(c);
    const b = oc.dot(this.direction);
    const disc = b * b - (oc.dot(oc) - radius * radius);
    if (disc < 0) return null;
    const sqrtDisc = Math.sqrt(disc);
    let t = -b - sqrtDisc;
    if (t < 0) t = -b + sqrtDisc;
    if (t < 0) return null;
    return this.at(t);
  }

  /**
   * Intersects the ray with an axis-aligned box using the slab method. If the
   * origin is inside the box, returns the exit point, as
   * {@link Ray.intersectSphere} does.
   *
   * @param min The box corner with the smallest x, y and z.
   * @param max The box corner with the largest x, y and z.
   * @returns A new {@link Vec3} where the ray enters the box (or leaves it,
   * from inside), or `null` if it misses or the box is behind it.
   */
  intersectBox(min: Vec3Like, max: Vec3Like): Vec3 | null {
    const lo = Vec3.interpolate(min);
    const hi = Vec3.interpolate(max);
    const origin = this.origin.array;
    const direction = this.direction.array;
    const los = lo.array;
    const his = hi.array;

    let tmin = -Infinity;
    let tmax = Infinity;

    for (let i = 0; i < 3; i++) {
      const o = origin[i];
      const d = direction[i];
      if (d === 0) {
        // Parallel to this slab: it either always lies within it or never does
        if (o < los[i] || o > his[i]) return null;
        continue;
      }
      let t0 = (los[i] - o) / d;
      let t1 = (his[i] - o) / d;
      if (t0 > t1) [t0, t1] = [t1, t0];
      tmin = Math.max(tmin, t0);
      tmax = Math.min(tmax, t1);
      if (tmin > tmax) return null;
    }

    if (tmax < 0) return null;
    return this.at(tmin >= 0 ? tmin : tmax);
  }
}

export { Ray };
