import { Vec2, Mat3 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { arrow, path } from './lib/draw.js'

// One Mat3 places, turns and stretches a shape. The pointer moves it.
export default function (container) {
  // A unit square around the origin, and an arrow along its local x axis
  const square = [
    new Vec2(-1, -1),
    new Vec2(1, -1),
    new Vec2(1, 1),
    new Vec2(-1, 1)
  ]

  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const at = pointer ?? new Vec2(width / 2, height / 2)
    const stretch = 1 + 0.5 * Math.sin(time * 1.3)

    // Read from the bottom up: stretch, then turn, then move. The last call
    // is the first applied to each point.
    const model = Mat3.identity()
      .translate(at)
      .rotate(time * 0.6)
      .scaleByVec2([40 * stretch, 40])

    const corners = square.map((p) => p.transformByMat3New(model))
    ctx.fillStyle = colours.one
    ctx.globalAlpha = 0.15
    ctx.beginPath()
    corners.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
    ctx.fill()
    ctx.globalAlpha = 1
    path(ctx, corners, colours.one, 1.5, true)

    // The shape's own axes, carried along by the same matrix
    const centre = new Vec2(0, 0).transformByMat3(model)
    arrow(ctx, centre, new Vec2(1.6, 0).transformByMat3(model), colours.two)
    arrow(ctx, centre, new Vec2(0, 1.6).transformByMat3(model), colours.three)
  })
}
