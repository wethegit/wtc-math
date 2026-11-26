# Quaternions

A `Quat` holds a rotation in 3D. Quaternions combine and interpolate cleanly, and don't suffer from gimbal lock. {.lead}

You rarely need to know what's inside one. Make a quaternion from an axis and an angle, or from Euler angles, combine it with others, and turn vectors or build matrices with it:

<Example src="quat-slerp" :height="340" />

<<< @/examples/quat-slerp.js

`Quat` extends [`Vec4`](/vectors/vec4), with the rotation in `x`, `y`, `z` and `w`. `new Quat()` and `Quat.identity()` are both no rotation, `(0, 0, 0, 1)`.

## Making one

`Quat.fromAxisAngle(axis, radians)` turns around an axis by an angle. The axis must be normalised:

```js
import { Quat, Vec3 } from 'wtc-math'

const quarterTurn = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
const tilt = Quat.fromAxisAngle(new Vec3(1, 1, 0).normalise(), 0.3)
```

`Quat.fromEuler(angles, order)` takes one angle per axis, in radians, as a `Vec3` or an array. The order says how they're combined, as in three.js, and defaults to `'YXZ'`, which suits a camera: heading around y, then pitch around the new x, then roll:

```js
const look = Quat.fromEuler([pitch, yaw, 0]) // YXZ
const other = Quat.fromEuler([0.1, 0.2, 0.3], 'XYZ')
```

The orders are `'XYZ'`, `'YXZ'`, `'ZXY'`, `'ZYX'`, `'YZX'` and `'XZY'`.

To read a rotation out of a matrix, use `Mat4`'s [`rotation`](/matrices/3d-transforms#taking-a-matrix-apart) getter.

## Turning things

`Vec3.transformByQuat(q)` rotates a vector:

```js
new Vec3(0, 0, 1).transformByQuat(quarterTurn) // (1, 0, 0)
```

`Mat4.fromQuat(q)` makes a rotation matrix, and `Mat4.fromRotationTranslationScale(q, position, scale)` a full model matrix:

```js
import { Mat4 } from 'wtc-math'

const model = Mat4.fromRotationTranslationScale(orientation, position, [1, 1, 1])
```

## Combining

`a.multiply(b)` combines two rotations into one that applies `b` first, then `a`, in the same order as [matrices](/matrices/3d-transforms#order). It changes `a` in place; `multiplyNew` leaves it alone.

```js
const yaw = Quat.fromAxisAngle(new Vec3(0, 1, 0), heading)
const pitch = Quat.fromAxisAngle(new Vec3(1, 0, 0), tilt)

// Pitch the object, then turn it to its heading
const orientation = yaw.multiplyNew(pitch)
```

Turning an orientation by a small amount every frame is one multiply. Normalise it now and then so rounding errors don't build up:

```js
const step = Quat.fromAxisAngle(axis, speed * delta)
orientation.multiply(step).normalise()
```

`conjugate()` reverses a unit quaternion's rotation, and `invert()` does the same for any quaternion. Use them to undo a rotation, or to find the rotation from one orientation to another:

```js
// The rotation that takes `from` to `to`
const difference = to.multiplyNew(from.invertNew())
```

`inverse()` and `inverseNew()` are other names for `invert()` and `invertNew()`. On a `Vec4` they take `1 / x` of each component instead.

## Interpolating

`Quat.slerp(a, b, t)` returns a new rotation `t` of the way from `a` to `b`, turning at a steady speed along the shortest path. Ease `t` for natural starts and stops, as the example does with [`smootherstep`](/utilities/scalars).

```js
const halfway = Quat.slerp(from, to, 0.5)
```

Don't interpolate rotations with `Quat.lerp`; it doesn't keep a steady speed or a unit length.

## Related

- [3D transforms](/matrices/3d-transforms)
- [Vec3](/vectors/vec3#rotation)
- API: [Quat](/api/wtc-math/classes/Quat), [QuatLike](/api/wtc-math/type-aliases/QuatLike)
