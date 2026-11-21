import { Vec3, Mat4 } from 'wtc-math'
import { stage } from './lib/stage.js'
import { cube, wireframe, toCanvas } from './lib/wire.js'
import { arrow } from './lib/draw.js'

// A moon on a planet: the moon's matrix is the planet's, times its own
// orbit. Moving the planet carries the moon with it.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, colours }) => {
    const projection = Mat4.perspective(Math.PI / 4, width / height, 0.1, 100)
    const view = Mat4.lookAt([0, 3, 8], [0, 0, 0], [0, 1, 0])
    const viewProjection = projection.multiply(view)

    // The planet circles the centre, spinning as it goes
    const planet = new Mat4()
      .rotate(time * 0.3, [0, 1, 0])
      .translate([3, 0, 0])
      .rotate(time, [0, 1, 0])

    // The moon starts from the planet's matrix, then orbits and shrinks
    const moon = planet
      .clone()
      .rotate(time * 1.5, [0, 0, 1])
      .translate([2, 0, 0])
      .scaleByVec3([0.35, 0.35, 0.35])

    wireframe(ctx, cube, viewProjection.multiplyNew(planet), width, height, colours.one)
    wireframe(ctx, cube, viewProjection.multiplyNew(moon), width, height, colours.two)

    // The planet's position is its matrix's translation
    const centre = toCanvas(planet.translation, viewProjection, width, height)
    const origin = toCanvas(new Vec3(), viewProjection, width, height)
    arrow(ctx, origin, centre, colours.three, 1.5)
  })
}
