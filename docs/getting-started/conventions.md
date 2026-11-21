# Conventions

A few rules hold across the whole library. Learn them once and every class reads the same way. {.lead}

## In place, or new

Most methods change the object they're called on and return it, so calls chain:

```js
import { Vec2 } from 'wtc-math'

const v = new Vec2(3, 4)
v.normalise().scale(10).rotate(Math.PI / 2) // v is now (-8, 6)
```

Each of those has a twin ending in `New` that leaves the original alone and returns a new object:

```js
const a = new Vec2(1, 2)
const b = a.addNew(new Vec2(3, 4)) // b is (4, 6), a is still (1, 2)
```

Use the in-place methods in hot loops, where making a new object every frame adds up, and the `New` methods when you want to keep the original. `clone()` gives you a copy to change:

```js
const next = position.clone().add(velocity.scaleNew(delta))
```

::: warning
The in-place methods change the object everywhere it's referenced. If two things share one vector, changing it through one changes it for both. Clone a vector before keeping it if its owner might change it later.
:::

Methods that compute a number, such as `dot`, `distance` or `length`, don't change anything. A few others return a new object without the `New` suffix too, notably `Vec3.cross` and the static helpers such as `Vec2.lerp`.

## Static helpers

Constructors that build an object from something else are static methods: `Mat4.perspective`, `Mat4.lookAt`, `Quat.fromAxisAngle`, `Quat.slerp`, `Color.fromHex`. They always return a new object.

```js
import { Mat4, Quat, Vec3 } from 'wtc-math'

const projection = Mat4.perspective(Math.PI / 3, 16 / 9, 0.1, 100)
const spin = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI)
```

## Angles

Angles are in radians unless a name says otherwise. Methods that take degrees say so: `rotateDeg`, `rotateToDeg`, `angleInDegrees`. Convert with `degToRad` and `radToDeg`:

```js
import { Vec2, degToRad } from 'wtc-math'

new Vec2(1, 0).rotate(degToRad(90)) // (0, 1)
new Vec2(1, 0).rotateDeg(90) // the same
```

Positive angles turn counter-clockwise when y points up. On a canvas, where y points down, they turn clockwise on screen.

## Column-major matrices

Matrices store their elements column by column, as WebGL and GLSL do. Element names read `a` + column + row, so in a `Mat4`:

- `a11`, `a12`, `a13`, `a14` are the first column,
- `a41`, `a42`, `a43` are the translation.

`.array` gives the elements in that order, ready for `gl.uniformMatrix4fv` or a wtc-gl `Uniform`.

`a.multiply(b)` gives `a × b`. Applied to a point, `b` happens first, then `a`. Methods such as `translate` and `rotate` multiply on the right in the same way, so the last one you call is the first applied to a point. [3D transforms](/matrices/3d-transforms#order) works through an example.

## Like types

Methods that read a value without keeping it usually accept a plain array or object as well as a class instance. These are the `…Like` types:

| Type                      | Accepts                                                  |
| ------------------------- | -------------------------------------------------------- |
| `Vec2Like`                | `Vec2`, `{ x, y }`, `[x, y]`                             |
| `Vec3Like`                | `Vec3`, `{ x, y, z }`, `[x, y, z]`                       |
| `Vec4Like`, `QuatLike`    | `Vec4`, `Quat`, `{ x, y, z, w }`, `[x, y, z, w]`         |
| `Mat2Like` … `Mat4Like`   | a matrix, or an array of its elements in column order    |
| `ColorLike`               | `Color`, `{ r, g, b, a? }`, `[r, g, b, a?]`, a hex string |

```js
import { Mat4 } from 'wtc-math'

const view = Mat4.lookAt([0, 2, 5], [0, 0, 0], [0, 1, 0])
```

Arithmetic such as `add` and `multiply` takes an instance of the same class. To turn a loose value into one, use the static `interpolate`:

```js
import { Vec2, Vec3 } from 'wtc-math'

Vec2.interpolate([3, 4]) // Vec2(3, 4)
Vec2.interpolate({ x: 3, y: 4 }) // Vec2(3, 4)
Vec2.interpolate('3, 4') // Vec2(3, 4), handy for data attributes
Vec2.interpolate(5) // Vec2(5, 5)
Vec3.interpolate([1, 2, 3]) // Vec3(1, 2, 3)
```

## Arrays and destructuring

Every vector and matrix has an `.array` getter with its components in order, and can be spread or destructured:

```js
const v = new Vec3(1, 2, 3)

v.array // [1, 2, 3]
const [x, y, z] = v
Math.max(...v) // 3
ctx.lineTo(...new Vec2(10, 20))
```

## Names

The library writes British English in its docs but keeps established names in code. Vectors have `normalise`; `Plane` has `normalize`. The colour class is `Color`.
