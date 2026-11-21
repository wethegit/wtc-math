/**
 * Small canvas helpers shared by the examples. Points are anything with an
 * x and a y, in CSS pixels.
 */

/** A line from `a` to `b` with an arrowhead at `b`. */
export function arrow(ctx, a, b, colour, width = 2) {
  const angle = Math.atan2(b.y - a.y, b.x - a.x)
  const head = 9
  ctx.strokeStyle = colour
  ctx.fillStyle = colour
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(
    b.x - Math.cos(angle) * head * 0.6,
    b.y - Math.sin(angle) * head * 0.6
  )
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(b.x, b.y)
  ctx.lineTo(
    b.x - Math.cos(angle - 0.4) * head,
    b.y - Math.sin(angle - 0.4) * head
  )
  ctx.lineTo(
    b.x - Math.cos(angle + 0.4) * head,
    b.y - Math.sin(angle + 0.4) * head
  )
  ctx.closePath()
  ctx.fill()
}

/** A line from `a` to `b`. */
export function line(ctx, a, b, colour, width = 1, dash = []) {
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.setLineDash(dash)
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.stroke()
  ctx.setLineDash([])
}

/** A filled circle. */
export function dot(ctx, p, colour, radius = 4) {
  ctx.fillStyle = colour
  ctx.beginPath()
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
  ctx.fill()
}

/** An outlined circle. */
export function ring(ctx, p, colour, radius, width = 1, dash = []) {
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.setLineDash(dash)
  ctx.beginPath()
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
}

/** Text in the docs' mono font. */
export function label(ctx, text, p, colour, font, align = 'left') {
  ctx.fillStyle = colour
  ctx.font = `500 12px ${font}`
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.fillText(text, p.x, p.y)
}

/** Axes through `origin`, with a faint grid every `step` pixels. */
export function axes(ctx, origin, width, height, colours, step = 40) {
  ctx.strokeStyle = colours.grid
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = origin.x % step; x < width; x += step) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = origin.y % step; y < height; y += step) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
  ctx.strokeStyle = colours.muted
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.moveTo(0, origin.y)
  ctx.lineTo(width, origin.y)
  ctx.moveTo(origin.x, 0)
  ctx.lineTo(origin.x, height)
  ctx.stroke()
  ctx.globalAlpha = 1
}

/** A polyline through `points`, closed if asked. */
export function path(ctx, points, colour, width = 1.5, closed = false) {
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.lineJoin = 'round'
  ctx.beginPath()
  points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
  if (closed) ctx.closePath()
  ctx.stroke()
}
