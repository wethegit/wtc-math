import { Vec2, Vec3 } from 'wtc-math'
import { Plane } from 'wtc-math/plane'
import { stage } from './lib/stage.js'
import { arrow, dot, label, line } from './lib/draw.js'

// A plane seen edge-on, as a line. The pointer is a point: its signed
// distance from the plane, and where it lands when projected onto it.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const centre = new Vec3(width / 2, height / 2, 0)
    const facing = new Vec2(0, -1).rotate(Math.sin(time * 0.3) * 0.6)
    const plane = Plane.fromNormalAndPoint([facing.x, facing.y, 0], centre)

    // Draw the plane as a long line through the centre
    const across = new Vec2(-facing.y, facing.x).scale(Math.hypot(width, height))
    line(ctx, centre.xy.subtract(across), centre.xy.add(across), colours.muted, 1.5)
    arrow(ctx, centre, centre.xy.add(facing.scaleNew(40)), colours.one)
    label(ctx, 'normal', centre.xy.add(facing.scaleNew(56)), colours.one, colours.font, 'center')

    const point = pointer
      ? new Vec3(pointer.x, pointer.y, 0)
      : new Vec3(width * 0.3, height * 0.3 + Math.sin(time) * height * 0.25, 0)
    const distance = plane.distanceTo(point)
    const onPlane = plane.projectPoint(point)

    line(ctx, point, onPlane, colours.muted, 1, [4, 4])
    dot(ctx, onPlane, colours.three)
    dot(ctx, point, distance >= 0 ? colours.one : colours.two, 5)
    label(
      ctx,
      `distanceTo = ${distance.toFixed(0)} (${distance >= 0 ? 'in front' : 'behind'})`,
      { x: 16, y: height - 20 },
      colours.muted,
      colours.font
    )
  })
}
