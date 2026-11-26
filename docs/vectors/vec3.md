# Vec3

A three-dimensional vector, for positions, directions, normals and scales in 3D. {.lead}

`Vec3` works like [`Vec2`](/vectors/vec2) with a third component: the same arithmetic, `length`, `normalise`, `distance`, `dot`, `lerp` and in-place and `New` forms. This page covers what's different in 3D.

```js
import { Vec3 } from 'wtc-math'

const position = new Vec3(0, 1.5, -4)
const up = new Vec3(0, 1, 0)
```

`width`, `height` and `depth` are other names for `x`, `y` and `z`, for when a `Vec3` holds a size, and `area` is their product, the volume.

## Cross product

`cross(v)` gives a vector at right angles to both, with a length equal to the area of the parallelogram they make. Its direction follows the right-hand rule: `x` cross `y` is `z`. Like other methods, `cross` changes the vector in place, and `crossNew` returns a new one:

```js
new Vec3(1, 0, 0).cross(new Vec3(0, 1, 0)) // (0, 0, 1)

const a = new Vec3(1, 0, 0)
const n = a.crossNew(new Vec3(0, 1, 0)) // n is (0, 0, 1), a is unchanged
```

Crossing two edges of a triangle gives its normal, the direction the face points. The dot product of the normal with the direction to the camera tells you which side of the face you're looking at:

<Example src="vec3-normal" :height="360" />

<<< @/examples/vec3-normal.js

## Rotation

`rotateX`, `rotateY` and `rotateZ` turn the vector around an axis through a point. Pass the point first, then the angle in radians:

```js
const centre = new Vec3(0, 0, 0)
const p = new Vec3(1, 0, 0)

p.rotateY(centre, Math.PI / 2) // (0, 0, -1)
```

Rotating a position around a point other than the origin orbits it around that point: `new Vec3(2, 0, 0).rotateY(new Vec3(1, 0, 0), Math.PI / 2)` gives `(1, 0, -1)`.

For an arbitrary axis, or to combine rotations, use a [quaternion](/rotation/quaternions) and `transformByQuat`:

```js
import { Vec3, Quat } from 'wtc-math'

const spin = Quat.fromAxisAngle(new Vec3(1, 1, 0).normalise(), Math.PI / 3)
const turned = new Vec3(0, 0, 1).transformByQuat(spin)
```

## Matrices

`transformByMat4(m)` treats the vector as a point and transforms it by a 4×4 matrix, including the translation. It divides by the resulting w, so a projection matrix takes a point straight to normalised device coordinates, from -1 to 1 on each axis:

```js
const ndc = worldPosition.transformByMat4New(viewProjection)
const screenX = (ndc.x + 1) * 0.5 * width
const screenY = (1 - ndc.y) * 0.5 * height
```

`transformByMat3(m)` multiplies by a 3×3 matrix with no translation, which suits directions and normals. [3D transforms](/matrices/3d-transforms) has more.

## Euler angles from a matrix

`Vec3.fromRotationMatrix(m, order)` reads the rotation out of a `Mat4` as Euler angles in radians, one per axis. The order defaults to `'YXZ'`, as in three.js, and can be any of `'XYZ'`, `'YXZ'`, `'ZXY'`, `'ZYX'`, `'YZX'` and `'XZY'`:

```js
import { Vec3, Mat4 } from 'wtc-math'

Vec3.fromRotationMatrix(Mat4.fromYRotation(0.5)) // (0, 0.5, 0)
```

## Spherical names

`radius`, `phi` and `theta` are other names for `x`, `y` and `z`, for a `Vec3` that holds spherical coordinates. They don't convert anything, so you do the trigonometry:

```js
const s = new Vec3(5, Math.PI / 3, Math.PI / 4) // radius, phi, theta
const p = new Vec3(
  s.radius * Math.sin(s.phi) * Math.cos(s.theta),
  s.radius * Math.cos(s.phi),
  s.radius * Math.sin(s.phi) * Math.sin(s.theta)
)
```

## Related

- [Vec2](/vectors/vec2), [Vec4](/vectors/vec4), [Swizzling](/vectors/swizzling)
- [Quaternions](/rotation/quaternions), [3D transforms](/matrices/3d-transforms)
- API: [Vec3](/api/wtc-math/classes/Vec3), [Vec3Like](/api/wtc-math/type-aliases/Vec3Like)
