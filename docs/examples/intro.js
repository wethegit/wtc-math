import { Vec2 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { arrow, axes, dot, label, line } from './lib/draw.js'

// Two vectors and their sum. Move the pointer to steer `b`.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const origin = new Vec2(width / 2, height / 2)
    axes(ctx, origin, width, height, colours)

    // y points down on a canvas, so flip it to draw maths the usual way up
    const toScreen = (v) => new Vec2(origin.x + v.x, origin.y - v.y)
    const fromScreen = (p) => new Vec2(p.x - origin.x, origin.y - p.y)

    const a = new Vec2(110, 0).rotate(time * 0.4)
    const b = pointer ? fromScreen(pointer) : new Vec2(-40, 90)
    const sum = a.addNew(b)

    // The parallelogram the sum completes
    line(ctx, toScreen(a), toScreen(sum), colours.muted, 1, [4, 4])
    line(ctx, toScreen(b), toScreen(sum), colours.muted, 1, [4, 4])

    arrow(ctx, origin, toScreen(a), colours.one)
    arrow(ctx, origin, toScreen(b), colours.two)
    arrow(ctx, origin, toScreen(sum), colours.three)
    dot(ctx, origin, colours.text, 3)

    const angle = Vec2.getAngle(a, b)
    label(ctx, 'a', toScreen(a.scaleNew(1.12)), colours.one, colours.font)
    label(ctx, 'b', toScreen(b.scaleNew(1.12)), colours.two, colours.font)
    label(ctx, 'a + b', toScreen(sum).addScalar(10), colours.three, colours.font)
    label(
      ctx,
      `|a + b| = ${sum.length.toFixed(1)}   angle(a, b) = ${((angle * 180) / Math.PI).toFixed(0)}°`,
      new Vec2(16, height - 20),
      colours.muted,
      colours.font
    )
  })
}
