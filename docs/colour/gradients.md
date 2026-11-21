# Gradients

Blend between colours with `Color.lerp`, `Color.lerpOklab` or `Color.lerpOklch`. They give quite different gradients from the same two colours. {.lead}

Each takes two colours and an amount from 0 to 1, and returns a new colour. Alpha is blended linearly in all three.

<Example src="gradients" :height="280" />

<<< @/examples/gradients.js

## The three blends

**`Color.lerp(a, b, t)`** blends the sRGB channels directly. It's the cheapest, and what CSS gradients have traditionally done, but colours far apart on the wheel pass through a dull, greyish middle: blue to yellow goes through grey.

**`Color.lerpOklab(a, b, t)`** blends in OKLab. Lightness changes evenly along the gradient and the middle stays clean, but complementary colours still pass close to grey, because the straight line between them crosses the centre of the colour space.

**`Color.lerpOklch(a, b, t)`** blends lightness, chroma and hue separately, turning the hue the shorter way around the wheel. The middle stays as colourful as the ends, passing through the hues between. When one end is grey it has no real hue, so the blend keeps the other end's hue rather than sweeping through unrelated colours.

```js
import { Color } from 'wtc-math/color'

const from = Color.fromHex('#1e3a8a')
const to = Color.fromHex('#fde047')

const middle = Color.lerpOklch(from, to, 0.5)
```

## Choosing

- `lerpOklch` for vivid gradients between different hues, and for animating a colour around the wheel.
- `lerpOklab` for gradients that should stay close to the two colours you chose, such as two shades of a brand colour, or a colour to grey.
- `lerp` when speed matters more than looks, or to match sRGB blending elsewhere, such as in a shader.

## Several stops

For a gradient with more than two colours, find the two stops either side of `t` and blend between them:

```js
function gradient(stops, t) {
  const scaled = Math.min(Math.max(t, 0), 1) * (stops.length - 1)
  const i = Math.min(Math.floor(scaled), stops.length - 2)
  return Color.lerpOklch(stops[i], stops[i + 1], scaled - i)
}

const heat = ['#000004', '#7c1d6f', '#f2741f', '#fcfdbf'].map(Color.fromHex)
const colour = gradient(heat, 0.6)
```

## Related

- [Colour spaces](/colour/colour-spaces)
- [Color](/colour/color)
