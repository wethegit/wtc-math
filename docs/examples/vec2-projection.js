import { Vec2 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { arrow, axes, dot, label, line } from './lib/draw.js'

// Projecting one vector onto another with the dot product. The pointer
// moves `v`; the line turns slowly.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const origin = new Vec2(width / 2, height / 2)
    axes(ctx, origin, width, height, colours)
    const toScreen = (v) => new Vec2(origin.x + v.x, origin.y - v.y)

    // A unit vector along the line
    const along = new Vec2(1, 0).rotate(time * 0.25)
    const v = pointer
      ? new Vec2(pointer.x - origin.x, origin.y - pointer.y)
      : new Vec2(60, 100).rotate(time * -0.5)

    // How far v reaches along the line, and the point it lands on
    const reach = v.dot(along)
    const projected = along.scaleNew(reach)

    const extent = Math.hypot(width, height)
    line(
      ctx,
      toScreen(along.scaleNew(-extent)),
      toScreen(along.scaleNew(extent)),
      colours.muted,
      1
    )
    line(ctx, toScreen(v), toScreen(projected), colours.muted, 1, [4, 4])
    arrow(ctx, origin, toScreen(projected), colours.three, 3)
    arrow(ctx, origin, toScreen(v), colours.two)
    arrow(ctx, origin, toScreen(along.scaleNew(50)), colours.one)
    dot(ctx, toScreen(projected), colours.three)

    label(ctx, 'along', toScreen(along.scaleNew(64)), colours.one, colours.font)
    label(ctx, 'v', toScreen(v.scaleNew(1.1)), colours.two, colours.font)
    label(
      ctx,
      `v.dot(along) = ${reach.toFixed(1)}`,
      new Vec2(16, height - 20),
      colours.muted,
      colours.font
    )
  })
}
