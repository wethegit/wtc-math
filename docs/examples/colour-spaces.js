import { Color } from 'wtc-math/color'
import { stage } from './lib/stage.js'
import { label } from './lib/draw.js'

// A sweep around the hue circle in HSL, and in OKLCH. Under each, the same
// colours with only their perceived lightness (OKLab L) kept: HSL's swings
// from dark blue to bright yellow, OKLCH's stays even.
export default function (container) {
  return stage(container, ({ ctx, width, height, time, colours }) => {
    const pad = 16
    const rowHeight = (height - pad * 5) / 4
    const steps = 90
    const stepWidth = (width - pad * 2) / steps
    const offset = time * 20

    const rows = [
      { name: 'Color.fromHSL(h, 1, 0.5)', make: (h) => Color.fromHSL(h, 1, 0.5) },
      { name: 'Color.fromOklch(0.7, 0.13, h)', make: (h) => Color.fromOklch(0.7, 0.13, h) }
    ]
    rows.forEach(({ name, make }, row) => {
      const y = pad + row * 2 * (rowHeight + pad)
      for (let i = 0; i < steps; i++) {
        const colour = make((i * 360) / steps + offset)
        const x = pad + i * stepWidth
        ctx.fillStyle = colour.toCSS()
        ctx.fillRect(x, y, stepWidth + 0.5, rowHeight)

        // The perceived lightness, as a grey
        const [L] = colour.toOklab()
        ctx.fillStyle = Color.fromOklab(L, 0, 0).toCSS()
        ctx.fillRect(x, y + rowHeight, stepWidth + 0.5, rowHeight)
      }
      label(ctx, name, { x: pad + 8, y: y + 14 }, '#000', colours.font)
    })
  })
}
