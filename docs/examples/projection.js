import { Vec3, Mat4 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { cube, wireframe } from './lib/wire.js'
import { label, line } from './lib/draw.js'

// The same row of cubes through a perspective camera (left) and an
// orthographic one (right). The pointer moves the camera.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
    const half = width / 2
    const aspect = half / height

    const angle = pointer ? (pointer.x / width - 0.5) * 2 : Math.sin(time * 0.4)
    const eye = new Vec3(Math.sin(angle) * 14, 4, Math.cos(angle) * 14)
    const view = Mat4.lookAt(eye, [0, 0, 0], [0, 1, 0])

    const perspective = Mat4.perspective(Math.PI / 4, aspect, 0.1, 100)
    // An orthographic box about as big as the perspective view at the centre
    const size = 5.5
    const orthographic = Mat4.ortho(-size * aspect, size * aspect, -size, size, 0.1, 100)

    const panels = [
      { projection: perspective, x: 0, name: 'Mat4.perspective' },
      { projection: orthographic, x: half, name: 'Mat4.ortho' }
    ]
    for (const { projection, x, name } of panels) {
      ctx.save()
      ctx.translate(x, 0)
      ctx.beginPath()
      ctx.rect(0, 0, half, height)
      ctx.clip()
      const viewProjection = projection.multiplyNew(view)
      for (let i = -2; i <= 2; i++) {
        const model = new Mat4().translate([0, 0, i * 2.5]).scaleByVec3([0.8, 0.8, 0.8])
        const colour = i === 0 ? colours.one : colours.two
        wireframe(ctx, cube, viewProjection.multiplyNew(model), half, height, colour)
      }
      label(ctx, name, { x: 16, y: height - 20 }, colours.muted, colours.font)
      ctx.restore()
    }
    line(ctx, { x: half, y: 0 }, { x: half, y: height }, colours.grid)
  })
}
