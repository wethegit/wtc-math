# Color

An RGBA colour, with each channel from 0 to 1, that converts to and from the formats you meet in CSS and design tools. {.lead}

```js
import { Color } from 'wtc-math/color'

const red = new Color(1, 0, 0)
const glass = new Color(0.6, 0.8, 1, 0.5)
```

`Color` has an entry point of its own, `wtc-math/color`. Its channels are `r`, `g`, `b` and `a`, read and written directly. They're sRGB values, the same as CSS uses, scaled to 0–1 rather than 0–255. Alpha defaults to 1.

## Making colours

From the formats you're most likely to have:

```js
Color.fromHex('#ff8800') // or '#f80', or 'ff8800'
Color.fromCSS('rgb(255 136 0 / 50%)') // hex, rgb(), rgba(), hsl() or hsla()
Color.fromRGB255(255, 136, 0)
Color.fromHSL(32, 1, 0.5) // hue in degrees, saturation and lightness 0–1
Color.fromHSV(32, 1, 1) // hue in degrees, saturation and value 0–1
Color.fromOklch(0.74, 0.18, 56) // see Colour spaces
```

`fromHex` reads 3- and 6-digit hex, and 4- and 8-digit hex with alpha last (`'#ff880080'`). `fromCSS` reads hex too, plus `rgb()`, `rgba()`, `hsl()` and `hsla()` in either the comma or the space syntax. Both throw an error for a string they can't read, including named colours such as `'red'`.

`Color.interpolate(value)` accepts any of a `Color`, a string `fromCSS` can read, an `[r, g, b, a?]` array or an `{ r, g, b, a? }` object, which is handy for options that take a colour in whatever form is to hand:

```js
function setTint(tint) {
  const colour = Color.interpolate(tint) // '#f80', 'rgb(255, 136, 0)', [1, 0.5, 0], { r: 1, g: 0.5, b: 0 }
}
```

## Using them

`toCSS()` gives a string for a canvas or a style, `rgb(…)` or `rgba(…)` depending on alpha, and `toString()` is the same. `toHex()` gives `#rrggbb`, dropping alpha. `array` gives `[r, g, b, a]`, ready for a shader uniform:

```js
const orange = Color.fromHex('#ff8800')

ctx.fillStyle = orange.toCSS() // 'rgb(255, 136, 0)'
element.style.color = `${orange}`
orange.toHex() // '#ff8800'
uniform.value = orange.array // [1, 0.533, 0, 1]
```

`toHSL()`, `toHSV()`, `toOklab()` and `toOklch()` give the colour in those spaces, as arrays of three numbers. Alpha is left out.

```js
orange.toHSL() // [32, 1, 0.5]
```

`toHex` and `toCSS` clamp each channel to 0–1 before formatting, so a colour you've done arithmetic on still gives a valid string. The colour itself isn't changed.

## Arithmetic

`add`, `multiply` and `multiplyScalar` change the colour in place; add `New` for a copy. `add` and `multiplyScalar` cap the channels at 1, and `multiplyScalar` leaves alpha alone:

```js
const lit = baseColour.multiplyNew(lightColour) // tint by a light
const brighter = baseColour.multiplyScalarNew(1.2)
```

## Blending

`lerp(c, t)` moves the colour `t` of the way towards `c`, and `Color.lerp(a, b, t)` returns the blend as a new colour. Both blend the sRGB channels directly, which is fast, but the midpoints of a blend can look muddy or too dark. For gradients, blend in OKLab or OKLCH instead; [Gradients](/colour/gradients) compares them.

## Related

- [Colour spaces](/colour/colour-spaces)
- [Gradients](/colour/gradients)
- API: [Color](/api/wtc-math/color/classes/Color), [ColorLike](/api/wtc-math/color/type-aliases/ColorLike)
