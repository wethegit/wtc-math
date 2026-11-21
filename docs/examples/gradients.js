import { Color } from 'wtc-math/color'
import { stage } from './lib/stage.js'
import { label } from './lib/draw.js'

// The same two colours blended three ways. The ends drift around the hue
// circle so you can compare many pairs.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, colours }) => {
    const pad = 16
    const rowHeight = (height - pad * 4) / 3
    const steps = 64
    const stepWidth = (width - pad * 2) / steps

    const from = Color.fromOklch(0.55, 0.2, 260 + time * 15)
    const to = Color.fromOklch(0.9, 0.17, 100 + time * 15)

    const rows = [
      ['Color.lerp', Color.lerp],
      ['Color.lerpOklab', Color.lerpOklab],
      ['Color.lerpOklch', Color.lerpOklch]
    ]
    rows.forEach(([name, blend], row) => {
      const y = pad + row * (rowHeight + pad)
      for (let i = 0; i < steps; i++) {
        ctx.fillStyle = blend(from, to, i / (steps - 1)).toCSS()
        ctx.fillRect(pad + i * stepWidth, y, stepWidth + 0.5, rowHeight)
      }
      label(ctx, name, { x: pad + 8, y: y + 14 }, '#fff', colours.font)
    })
  })
}
