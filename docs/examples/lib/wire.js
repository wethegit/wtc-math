import { Vec2, Vec3 } from 'wtc-math'

/** The corners of a cube from -1 to 1, and the pairs of corners its edges join. */
export const cube = {
  points: [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
  ].map((p) => new Vec3(...p)),
  edges: [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ]
}

/**
 * Take a point through a model-view-projection matrix to the canvas, from
 * normalised device coordinates (-1 to 1, y up) to pixels (y down).
 */
export function toCanvas(point, matrix, width, height) {
  const ndc = point.transformByMat4New(matrix)
  return new Vec2((ndc.x + 1) * 0.5 * width, (1 - ndc.y) * 0.5 * height)
}

/** Draw a wireframe through a matrix. */
export function wireframe(ctx, shape, matrix, width, height, colour, lineWidth = 1.5) {
  const screen = shape.points.map((p) => toCanvas(p, matrix, width, height))
  ctx.strokeStyle = colour
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (const [a, b] of shape.edges) {
    ctx.moveTo(screen[a].x, screen[a].y)
    ctx.lineTo(screen[b].x, screen[b].y)
  }
  ctx.stroke()
}
