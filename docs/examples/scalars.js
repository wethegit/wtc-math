import { Vec2, lerp, smoothstep, smootherstep, pingpong, map } from 'wtc-math'
import { stage } from './lib/stage.js'
import { dot, label, line, path } from './lib/draw.js'

// The easing curves, plotted from 0 to 1, with a dot riding each one.
export default function (container) {
  const curves = [
    ['t', (t) => t],
    ['smoothstep(0, 1, t)', (t) => smoothstep(0, 1, t)],
    ['smootherstep(0, 1, t)', (t) => smootherstep(0, 1, t)]
  ]

  return stage(container, ({ ctx, width, height, time, colours }) => {
    const pad = 32
    const size = Math.min(width * 0.55, height) - pad * 2
    const left = pad
    const bottom = height - pad
    // Graph space (0–1) to the canvas
    const toCanvas = (x, y) =>
      new Vec2(map(x, 0, 1, left, left + size), map(y, 0, 1, bottom, bottom - size))

    line(ctx, toCanvas(0, 0), toCanvas(1, 0), colours.muted)
    line(ctx, toCanvas(0, 0), toCanvas(0, 1), colours.muted)

    // Back and forth along the x axis, once every two seconds
    const t = pingpong(time * 0.5, 1)
    const series = [colours.muted, colours.one, colours.two]

    curves.forEach(([name, curve], i) => {
      const points = []
      for (let s = 0; s <= 60; s++) points.push(toCanvas(s / 60, curve(s / 60)))
      path(ctx, points, series[i], i ? 2 : 1)
      dot(ctx, toCanvas(t, curve(t)), series[i], 5)

      // The same value driving a position on the right
      const x = lerp(left + size + pad * 2, width - pad, curve(t))
      const y = pad + 20 + i * 44
      line(ctx, { x: left + size + pad * 2, y }, { x: width - pad, y }, colours.grid)
      dot(ctx, { x, y }, series[i], 7)
      label(ctx, name, { x: left + size + pad * 2, y: y + 18 }, series[i], colours.font)
    })
  })
}
