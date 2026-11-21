# Scalar functions

Small functions on plain numbers, for the clamping, blending, remapping and easing that turn up in every sketch. {.lead}

```js
import { clamp, lerp, map, pingpong } from 'wtc-math'
import { smoothstep, smootherstep, degToRad, radToDeg } from 'wtc-math'
```

<Example src="scalars" :height="300" />

<<< @/examples/scalars.js

## clamp

`clamp(v, min, max)` keeps a value within a range:

```js
clamp(1.4, 0, 1) // 1
clamp(-3, 0, 1) // 0
```

## lerp

`lerp(a, b, t)` returns the value `t` of the way from `a` to `b`. `t` isn't clamped, so values outside 0–1 carry on past the ends:

```js
lerp(10, 20, 0.25) // 12.5

// Ease towards a target a tenth of the way each frame
x = lerp(x, target, 0.1)
```

`Vec2.lerp`, `Vec3.lerp` and `Color.lerp` do the same for vectors and colours.

## map

`map(v, inMin, inMax, outMin, outMax)` remaps a value from one range to another. It doesn't clamp, so wrap it in `clamp` if the input can leave its range:

```js
map(5, 0, 10, 100, 200) // 150

// Scroll position to a 0–1 progress through a section
const progress = clamp(map(scrollY, start, end, 0, 1), 0, 1)
```

Make sure `inMin` and `inMax` differ, or it divides by zero.

## smoothstep and smootherstep

`smoothstep(edge0, edge1, x)` is 0 below `edge0`, 1 above `edge1`, and eases smoothly between them, with no sudden change of speed at either end. `smootherstep` is Ken Perlin's variant, flatter at the ends. Both match the GLSL functions of the same name, so the same easing works on the CPU and in a shader.

```js
smoothstep(0, 1, 0.25) // 0.15625

// Fade in as an element scrolls through the middle of the screen
const opacity = smoothstep(0.3, 0.7, progress)
```

Use them to ease an animation's `t`, to soften a threshold, or to fade something in over a range.

## pingpong

`pingpong(t, length)` runs from 0 up to `length` and back down again as `t` grows, for things that go back and forth:

```js
pingpong(0.5, 2) // 0.5
pingpong(3, 2) // 1, on the way back down

const swing = pingpong(time, 1) // 0 → 1 → 0 → 1 …
```

It's meant for `t` of 0 or more.

## degToRad and radToDeg

Every angle in wtc-math is in radians unless its name says otherwise. Convert with:

```js
degToRad(180) // Math.PI
radToDeg(Math.PI / 2) // 90
```

## Related

- [Conventions](/getting-started/conventions#angles)
- API: [clamp](/api/wtc-math/functions/clamp), [lerp](/api/wtc-math/functions/lerp), [map](/api/wtc-math/functions/map), [smoothstep](/api/wtc-math/functions/smoothstep), [smootherstep](/api/wtc-math/functions/smootherstep), [pingpong](/api/wtc-math/functions/pingpong), [degToRad](/api/wtc-math/functions/degToRad), [radToDeg](/api/wtc-math/functions/radToDeg)
