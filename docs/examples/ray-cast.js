import { Vec2, Vec3 } from 'wtc-math'
import { Ray } from 'wtc-math/ray'
import { Plane } from 'wtc-math/plane'
import { stage } from './lib/stage.js'
import { dot, line, ring, label } from './lib/draw.js'

// Rays against spheres, a box and a plane, seen from the side: everything
// sits at z = 0, so the 3D shapes show as circles, a square and a line. The
// pointer aims the rays.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const spheres = [
      { centre: new Vec3(width * 0.55, height * 0.3, 0), radius: 34 },
      { centre: new Vec3(width * 0.75, height * 0.62, 0), radius: 48 }
    ]
    const box = {
      min: new Vec3(width * 0.4, height * 0.58, -30),
      max: new Vec3(width * 0.5, height * 0.78, 30)
    }
    // The floor, facing up the screen (y points down on a canvas)
    const floor = Plane.fromNormalAndPoint([0, -1, 0], [0, height - 24, 0])

    ring(ctx, spheres[0].centre, colours.muted, spheres[0].radius)
    ring(ctx, spheres[1].centre, colours.muted, spheres[1].radius)
    ctx.strokeStyle = colours.muted
    ctx.strokeRect(box.min.x, box.min.y, box.max.x - box.min.x, box.max.y - box.min.y)
    line(ctx, { x: 0, y: height - 24 }, { x: width, y: height - 24 }, colours.muted)

    const origin = new Vec3(28, height * 0.4, 0)
    const target = pointer
      ? new Vec3(pointer.x, pointer.y, 0)
      : new Vec3(width * 0.7, height * 0.5 + Math.sin(time * 0.6) * height * 0.4, 0)

    // A fan of rays around the aim
    let hits = 0
    for (let i = -4; i <= 4; i++) {
      const aim = new Vec2(target.x - origin.x, target.y - origin.y).rotate(i * 0.06)
      const ray = new Ray(origin, [aim.x, aim.y, 0])

      // The nearest of everything the ray hits
      const candidates = [
        ...spheres.map((s) => ray.intersectSphere(s.centre, s.radius)),
        ray.intersectBox(box.min, box.max),
        ray.intersectPlane(floor)
      ].filter(Boolean)
      const hit = candidates.sort(
        (a, b) => a.distance(origin) - b.distance(origin)
      )[0]

      const end = hit ?? ray.at(Math.hypot(width, height))
      line(ctx, origin, end, i === 0 ? colours.one : colours.grid, i === 0 ? 2 : 1)
      if (hit) {
        dot(ctx, hit, colours.three, i === 0 ? 5 : 3)
        hits++
      }
    }
    dot(ctx, origin, colours.one, 5)
    label(ctx, `${hits} of 9 rays hit`, { x: 16, y: 20 }, colours.muted, colours.font)
  })
}
