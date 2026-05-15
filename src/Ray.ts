import { Vec3 } from "./Vec3";
import type { Vec3Like } from "./types";
import { Plane } from "./Plane";

class Ray {
  origin: Vec3;
  direction: Vec3;

  // direction is normalized on construction
  constructor(
    origin: Vec3Like = new Vec3(0, 0, 0),
    direction: Vec3Like = new Vec3(0, 0, -1)
  ) {
    this.origin = Vec3.interpolate(origin);
    this.direction = Vec3.interpolate(direction).normalise();
  }

  clone(): Ray {
    return new Ray(this.origin.clone(), this.direction.clone());
  }

  // Point along the ray at parameter t
  at(t: number): Vec3 {
    return this.origin.addNew(this.direction.multiplyScalarNew(t));
  }

  // Shortest distance from the ray to a point
  distanceTo(point: Vec3Like): number {
    const p = Vec3.interpolate(point);
    const diff = p.subtractNew(this.origin);
    const t = Math.max(0, diff.dot(this.direction));
    return diff.subtractNew(this.direction.multiplyScalarNew(t)).length;
  }

  // Closest point on the ray to a given point
  closestPoint(point: Vec3Like): Vec3 {
    const p = Vec3.interpolate(point);
    const t = Math.max(0, p.subtractNew(this.origin).dot(this.direction));
    return this.at(t);
  }

  intersectPlane(plane: Plane): Vec3 | null {
    const denom = plane.normal.dot(this.direction);
    if (Math.abs(denom) < 1e-6) return null;
    const t = -(plane.normal.dot(this.origin) + plane.constant) / denom;
    if (t < 0) return null;
    return this.at(t);
  }

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

  // AABB intersection via the slab method — Infinity arithmetic handles axis-aligned rays correctly
  intersectBox(min: Vec3Like, max: Vec3Like): Vec3 | null {
    const lo = Vec3.interpolate(min);
    const hi = Vec3.interpolate(max);
    const { x: ox, y: oy, z: oz } = this.origin;
    const { x: dx, y: dy, z: dz } = this.direction;

    let tmin = (lo.x - ox) / dx;
    let tmax = (hi.x - ox) / dx;
    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (lo.y - oy) / dy;
    let tymax = (hi.y - oy) / dy;
    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if (tmin > tymax || tymin > tmax) return null;
    tmin = Math.max(tmin, tymin);
    tmax = Math.min(tmax, tymax);

    let tzmin = (lo.z - oz) / dz;
    let tzmax = (hi.z - oz) / dz;
    if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

    if (tmin > tzmax || tzmin > tmax) return null;
    tmin = Math.max(tmin, tzmin);

    if (tmin < 0) return null;
    return this.at(tmin);
  }
}

export { Ray };
