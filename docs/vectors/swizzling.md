# Swizzling

Read a vector's components in a different order, or a few of them at once, as you would in GLSL. {.lead}

Each vector has getters named after combinations of its components. They return a new vector with those components in that order:

```js
import { Vec2, Vec3, Vec4 } from 'wtc-math'

new Vec2(1, 2).yx // Vec2(2, 1)

const v = new Vec3(1, 2, 3)
v.xy // Vec2(1, 2)
v.zx // Vec2(3, 1)
v.zxy // Vec3(3, 1, 2)

const q = new Vec4(1, 2, 3, 4)
q.xyz // Vec3(1, 2, 3)
q.wxyz // Vec4(4, 1, 2, 3)
```

The result is a copy, so changing it doesn't change the original.

## Which swizzles there are

| Class  | Two components                                           | Three                 | Four                        |
| ------ | -------------------------------------------------------- | --------------------- | --------------------------- |
| `Vec2` | `xy`, `yx`, `xx`, `yy`                                   |                       |                             |
| `Vec3` | `xy`, `yz`, `zx`, `yx`, `zy`, `xx`, `yy`, `zz`           | `xyz`, `yzx`, `zxy`   |                             |
| `Vec4` | every pair of `x`, `y`, `z` and `w`, such as `xz`, `zw`  | `xyz`, `yzx`, `zxy`   | `xyzw`, `yzwx`, `zwxy`, `wxyz` |

This is a useful subset, not every combination GLSL allows.

## Setting

Assigning to a swizzle writes into those components, from a vector or an array:

```js
const v = new Vec3(1, 2, 3)

v.xy = [9, 8] // Vec3(9, 8, 3)
v.yz = new Vec2(0, 0) // Vec3(9, 0, 0)

const p = new Vec4(1, 2, 3, 4)
p.xyz = [7, 8, 9] // Vec4(7, 8, 9, 4)
```

Stick to the pairs in order (`xy`, `yz`, `zw` and so on), `yx`, `zx`, and the in-order `xyz` and `xyzw`, whose setters write the components in the order the name gives.

## Where it's useful

Drawing a 3D point on a 2D canvas, ignoring depth:

```js
ctx.lineTo(...position.xy)
```

Swapping a 2D direction's components, then flipping one, to get a perpendicular, a quarter turn counter-clockwise:

```js
const perpendicular = direction.yx.multiply(new Vec2(-1, 1))
```

Dropping `w` after a perspective divide:

```js
const ndc = clip.xyz.scale(1 / clip.w)
```

## Related

- [Vec2](/vectors/vec2), [Vec3](/vectors/vec3), [Vec4](/vectors/vec4)
