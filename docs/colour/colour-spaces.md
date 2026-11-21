# Colour spaces

`Color` converts between sRGB, HSL, HSV, OKLab and OKLCH. Which one you work in changes how predictable your colours are. {.lead}

The channels a `Color` stores are sRGB, the space CSS and most images use. The other spaces are ways of describing the same colours that make some changes easier: rotating a hue, darkening, desaturating.

<Example src="colour-spaces" :height="300" />

<<< @/examples/colour-spaces.js

## HSL and HSV

HSL and HSV describe a colour by hue, an angle around the colour wheel in degrees, and two amounts from 0 to 1: saturation and lightness (HSL), or saturation and value (HSV, also called HSB). They're familiar from colour pickers and quick to compute.

```js
import { Color } from 'wtc-math/color'

const [h, s, l] = Color.fromHex('#3388ff').toHSL()
const complement = Color.fromHSL((h + 180) % 360, s, l)
```

Their weakness is that "lightness" doesn't match what you see. At the same HSL lightness, yellow looks far brighter than blue, as the top strips in the example show. Swap the hue in a palette built in HSL and its contrast changes with it.

## OKLab and OKLCH

[OKLab](https://bottosson.github.io/posts/oklab/) is a perceptual colour space: equal steps in it look like roughly equal changes. Its `L` is perceived lightness from 0 to 1, and `a` and `b` run from green to red and from blue to yellow.

OKLCH is OKLab in polar form, the perceptual counterpart of HSL:

- `L`, lightness, 0 to 1,
- `C`, chroma or colourfulness, from 0 for grey up to about 0.4 for the most vivid colours a screen can show,
- `H`, hue in degrees.

```js
const [L, C, H] = Color.fromHex('#3388ff').toOklch()

// The same lightness and chroma at other hues: a palette with even contrast
const palette = [0, 72, 144, 216, 288].map((offset) =>
  Color.fromOklch(L, C, (H + offset) % 360)
)
```

That's the bottom strip in the example: every hue at the same `L` and `C`, and the greys under it barely change.

`Color.fromOklch` and `Color.fromOklab` clamp each channel to 0–1, because not every combination of `L`, `C` and `H` is a colour a screen can show. Very high chroma at very high or low lightness gets clipped and shifts in hue, so keep chroma moderate (0.1–0.2) for colours that hold their hue across the wheel.

## Which to use

- **sRGB** to store, format and send colours, and for arithmetic that models light, such as tinting.
- **HSL or HSV** to match a design tool or a colour picker.
- **OKLCH** to build palettes, adjust lightness or chroma predictably, or rotate hues without changing contrast.
- **OKLab or OKLCH** to [blend](/colour/gradients).

## Related

- [Color](/colour/color)
- [Gradients](/colour/gradients)
- API: [Color](/api/wtc-math/color/classes/Color)
