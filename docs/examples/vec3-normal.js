import { Vec2, Vec3, Mat4 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { arrow, dot, label, path } from './lib/draw.js'

// A triangle's normal from the cross product of two of its edges. The
// triangle tumbles; the pointer tilts the camera.
export default function (container) {
  const corners = [new Vec3(-1, -0.7, 0), new Vec3(1, -0.7, 0), new Vec3(0, 1, 0)]
  const centre = new Vec3()

  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    // A camera, and a matrix that takes a point to the screen
    const tilt = pointer ? (pointer.y / height - 0.5) * 4 : 1
    const eye = new Vec3(0, tilt, 5)
    const view = Mat4.lookAt(eye, [0, 0, 0], [0, 1, 0])
    const projection = Mat4.perspective(Math.PI / 4, width / height, 0.1, 100)
    const viewProjection = projection.multiplyNew(view)
    const toScreen = (p) => {
      const ndc = p.transformByMat4New(viewProjection)
      return new Vec2((ndc.x + 1) * 0.5 * width, (1 - ndc.y) * 0.5 * height)
    }

    // Turn the corners around the centre
    const points = corners.map((p) =>
      p.clone().rotateY(centre, time * 0.7).rotateX(centre, time * 0.3)
    )

    // Two edges from the first corner, crossed, give the face's normal
    const [a, b, c] = points
    const normal = b.subtractNew(a).cross(c.subtractNew(a)).normalise()
    const mid = a.addNew(b).add(c).scale(1 / 3)

    // Facing the camera when the normal points back towards the eye
    const facing = normal.dot(eye.subtractNew(mid)) > 0

    const screen = points.map(toScreen)
    ctx.globalAlpha = facing ? 0.18 : 0.06
    ctx.fillStyle = colours.one
    ctx.beginPath()
    screen.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
    ctx.fill()
    ctx.globalAlpha = 1
    path(ctx, screen, colours.one, 1.5, true)
    screen.forEach((p) => dot(ctx, p, colours.one, 3))

    arrow(ctx, toScreen(mid), toScreen(mid.addNew(normal)), colours.three)
    label(ctx, 'normal', toScreen(mid.addNew(normal.scaleNew(1.2))), colours.three, colours.font, 'center')
    label(
      ctx,
      facing ? 'front face' : 'back face',
      new Vec2(16, height - 20),
      colours.muted,
      colours.font
    )
  })
}
