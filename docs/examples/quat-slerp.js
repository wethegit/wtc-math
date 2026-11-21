import { Vec3, Mat4, Quat, smootherstep } from 'wtc-math'
import { stage } from './lib/stage.js'
import { cube, wireframe, toCanvas } from './lib/wire.js'
import { arrow } from './lib/draw.js'

// Turning smoothly from one orientation to the next with Quat.slerp.
export default function (container) {
  // Random orientations to visit, each from a random axis and angle
  const randomOrientation = () =>
    Quat.fromAxisAngle(
      new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalise(),
      Math.random() * Math.PI * 2
    )
  let from = Quat.identity()
  let to = randomOrientation()
  let leg = 0

  return stage(container, ({ ctx, width, height, time, colours }) => {
    // Two seconds a leg: turn for one and a half, then rest
    const thisLeg = Math.floor(time / 2)
    if (thisLeg !== leg) {
      leg = thisLeg
      from = to
      to = randomOrientation()
    }
    const t = smootherstep(0, 1.5, time % 2)
    const orientation = Quat.slerp(from, to, t)

    const projection = Mat4.perspective(Math.PI / 4, width / height, 0.1, 100)
    const view = Mat4.lookAt([0, 0, 7], [0, 0, 0], [0, 1, 0])
    const viewProjection = projection.multiply(view)
    const model = Mat4.fromQuat(orientation)

    wireframe(ctx, cube, viewProjection.multiplyNew(model), width, height, colours.muted, 1)

    // The object's own axes, turned by the quaternion
    const origin = toCanvas(new Vec3(), viewProjection, width, height)
    const axes = [
      [new Vec3(1.8, 0, 0), colours.one],
      [new Vec3(0, 1.8, 0), colours.two],
      [new Vec3(0, 0, 1.8), colours.three]
    ]
    for (const [axis, colour] of axes) {
      const tip = axis.transformByQuat(orientation)
      arrow(ctx, origin, toCanvas(tip, viewProjection, width, height), colour)
    }
  })
}
