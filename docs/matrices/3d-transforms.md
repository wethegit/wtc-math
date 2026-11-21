# 3D transforms

Place, turn and scale things in 3D with `Mat4`. {.lead}

A `Mat4` holds a whole transform: rotation, scale and translation in one matrix. Multiplying matrices combines transforms, so an object's matrix can start from its parent's, and anything you do to the parent carries the child along:

<Example src="mat4-hierarchy" :height="360" />

<<< @/examples/mat4-hierarchy.js

`new Mat4()` is the identity. Like every matrix in wtc-math it's column-major: `a11`–`a14` are the first column, and `a41`, `a42` and `a43` are the translation.

## Building up a transform

`translate`, `rotate` and `scaleByVec3` change the matrix in place and chain:

```js
import { Mat4 } from 'wtc-math'

const model = new Mat4()
  .translate([0, 1, -5])
  .rotate(Math.PI / 4, [0, 1, 0])
  .scaleByVec3([2, 2, 2])
```

- `translate(v)` moves along the matrix's own axes, so after a rotation it moves in the rotated directions.
- `rotate(radians, axis)` turns around an axis through the matrix's origin. Normalise the axis.
- `scaleByVec3(v)` stretches along the matrix's own axes and leaves the translation alone.

`transform(v)` adds to the translation in world space instead, ignoring any rotation, and `transformTo(v)` sets it outright.

::: tip
`scale(n)` multiplies every element by `n`, including the translation and the bottom-right 1, so it isn't a scaling transform. Use `scaleByVec3`.
:::

## Order

Each of those calls multiplies on the right. Applied to a point, the last call happens first. The example above scales the point by 2, turns it 45° around y, then moves it to (0, 1, -5): read the chain from the bottom up.

`multiply` works the same way: `a.multiply(b)` gives `a × b`, which applies `b` first, then `a`. That's why a child's matrix is its parent's times its own, and why a model-view-projection matrix is written in this order:

```js
const mvp = projection.multiplyNew(view).multiply(model)
```

## From parts

When you already have a position, rotation and scale, build the matrix in one step:

```js
import { Mat4, Quat, Vec3 } from 'wtc-math'

const rotation = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
const model = Mat4.fromRotationTranslationScale(rotation, [1, 2, 3], [2, 2, 2])
```

`fromRotationTranslationScaleOrigin(q, v, s, origin)` does the same, rotating and scaling around `origin` instead of the matrix's own origin. `fromQuat(q)` is a rotation alone, and `fromXRotation`, `fromYRotation`, `fromZRotation` and `fromRotation(radians, axis)` turn around one axis.

## Taking a matrix apart

`translation` gives the position as a `Vec3`, `scaling` the scale on each axis, and `rotation` the rotation as a [`Quat`](/rotation/quaternions):

```js
model.translation // Vec3(1, 2, 3)
model.scaling // Vec3(2, 2, 2)
model.rotation // Quat
```

`rotation` is only exact when the scale is the same on every axis. For Euler angles, use [`Vec3.fromRotationMatrix`](/vectors/vec3#euler-angles-from-a-matrix).

## Applying it

`Vec3.transformByMat4` transforms a point, translation included:

```js
import { Vec3 } from 'wtc-math'

const world = new Vec3(1, 0, 0).transformByMat4(model)
```

For a direction or a normal, which shouldn't move with the translation, use the upper 3×3. `Mat3.fromMat4(m)` gives the normal matrix, the inverse transpose of that 3×3, which keeps normals at right angles to their surfaces when a model is scaled unevenly:

```js
import { Mat3 } from 'wtc-math'

const normalMatrix = Mat3.fromMat4(model) // null if model can't be inverted
const normal = new Vec3(0, 1, 0).transformByMat3(normalMatrix).normalise()
```

## Inverting

`invert()` gives the transform that undoes this one, for example to take a world-space point into an object's local space, or to turn a camera's matrix into a view matrix. A matrix that can't be inverted (its `determinant` is 0) is left as it is.

```js
const local = worldPoint.transformByMat4New(model.invertNew())
```

## Related

- [Cameras and projection](/matrices/projection)
- [Quaternions](/rotation/quaternions)
- [2D transforms](/matrices/2d-transforms)
- API: [Mat4](/api/wtc-math/classes/Mat4), [Mat3](/api/wtc-math/classes/Mat3)
