# Vec4

A four-dimensional vector, for homogeneous coordinates, RGBA values and anything else that comes in fours. {.lead}

`Vec4` has the same arithmetic, `length`, `normalise`, `dot` and in-place and `New` methods as [`Vec2`](/vectors/vec2) and [`Vec3`](/vectors/vec3), with a fourth component, `w`.

```js
import { Vec4 } from 'wtc-math'

const point = new Vec4(1, 2, 3, 1) // w = 1: a position
const direction = new Vec4(0, 0, -1, 0) // w = 0: a direction
```

## Homogeneous coordinates

In 3D graphics, a point is often written as four numbers with `w` set to 1, and a direction with `w` set to 0. A 4×4 matrix then moves points but only turns directions, since the translation is multiplied by `w`.

`transformByMat4(m)` multiplies the vector by a column-major 4×4 matrix. Unlike `Vec3.transformByMat4`, it doesn't divide by `w` afterwards, so after a projection you get clip coordinates and do the divide yourself:

```js
import { Vec4, Mat4 } from 'wtc-math'

const clip = new Vec4(0, 0, -5, 1).transformByMat4(viewProjection)
const ndc = clip.xyz.scale(1 / clip.w)
```

`transformByQuat(q)` rotates the x, y and z components by a quaternion.

## Size

`width`, `height` and `depth` are other names for `x`, `y` and `z`. `area` is the product of all four components.

## Getting smaller vectors out

The [swizzle](/vectors/swizzling) getters return smaller vectors: `xyz` gives a `Vec3`, and `xy`, `zw` and the rest give a `Vec2`.

```js
const v = new Vec4(1, 2, 3, 4)

v.xyz // Vec3(1, 2, 3)
v.zw // Vec2(3, 4)
```

## Quaternions

[`Quat`](/rotation/quaternions) extends `Vec4`, so it has all of these methods too. Some don't mean much for a rotation; the quaternion page covers the ones that do.

## Related

- [Vec3](/vectors/vec3), [Swizzling](/vectors/swizzling)
- [Quaternions](/rotation/quaternions)
- API: [Vec4](/api/wtc-math/classes/Vec4), [Vec4Like](/api/wtc-math/type-aliases/Vec4Like)
