import { Vec2 } from 'wtc-math'

/**
 * A 2D canvas for a live example. Give it the container `<Example>` passes
 * in and a draw function, and return what it returns:
 *
 *   export default function (container) {
 *     return stage(container, ({ ctx, width, height, time, pointer, colours }) => {
 *       // draw a frame
 *     })
 *   }
 *
 * `draw` is called every frame while the example plays, and again when the
 * pointer moves or the canvas resizes, so interaction works while paused.
 * The canvas is cleared first, and `ctx` is scaled so you draw in CSS
 * pixels. `pointer` is a Vec2 in CSS pixels, or null when it's off the
 * canvas. `colours` follow the docs' light and dark themes.
 */
export function stage(container, draw, { onPointerDown, onPointerUp } = {}) {
  const canvas = document.createElement('canvas')
  canvas.style.touchAction = 'none'
  container.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const state = {
    ctx,
    canvas,
    width: 0,
    height: 0,
    time: 0,
    delta: 0,
    pointer: null,
    down: false,
    colours: readColours()
  }

  const redraw = () => {
    if (!state.width || !state.height) return
    const dpr = Math.min(devicePixelRatio, 2)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, state.width, state.height)
    draw(state)
  }

  const toLocal = (e) => {
    const rect = canvas.getBoundingClientRect()
    return new Vec2(e.clientX - rect.left, e.clientY - rect.top)
  }
  const move = (e) => {
    state.pointer = toLocal(e)
    redraw()
  }
  const down = (e) => {
    state.down = true
    state.pointer = toLocal(e)
    canvas.setPointerCapture(e.pointerId)
    onPointerDown?.(state)
    redraw()
  }
  const up = () => {
    state.down = false
    onPointerUp?.(state)
    redraw()
  }
  const leave = () => {
    if (state.down) return
    state.pointer = null
    redraw()
  }
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)
  canvas.addEventListener('pointerleave', leave)

  // The colours change when the docs switch between light and dark
  const themeObserver = new MutationObserver(() => {
    state.colours = readColours()
    redraw()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return {
    state,
    frame(time, delta) {
      state.time = time
      state.delta = delta
      redraw()
    },
    resize(width, height) {
      const dpr = Math.min(devicePixelRatio, 2)
      state.width = width
      state.height = height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      redraw()
    },
    dispose() {
      themeObserver.disconnect()
      canvas.remove()
    }
  }
}

/** The docs' theme colours, read from the CSS custom properties. */
function readColours() {
  const style = getComputedStyle(document.documentElement)
  const get = (name) => style.getPropertyValue(name).trim()
  return {
    text: get('--vp-c-text-1'),
    muted: get('--vp-c-text-3'),
    grid: get('--vp-c-divider'),
    one: get('--docs-c-1'),
    two: get('--docs-c-2'),
    three: get('--docs-c-3'),
    font: get('--vp-font-family-mono')
  }
}
