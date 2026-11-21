# Cameras and projection

Turn a 3D scene into a 2D picture with a view matrix and a projection matrix. {.lead}

Drawing a point takes three matrices. The **model** matrix places an object in the world, the **view** matrix moves the world so the camera is at the origin looking down -z, and the **projection** matrix squashes what the camera sees into WebGL's clip space, from -1 to 1 on every axis.

```js
import { Mat4 } from 'wtc-math'

const model = new Mat4().translate([0, 0.5, 0])
const view = Mat4.lookAt([0, 2, 6], [0, 0, 0], [0, 1, 0])
const projection = Mat4.perspective(Math.PI / 4, width / height, 0.1, 100)

const mvp = projection.multiplyNew(view).multiply(model)
```

The projection is on the left because it's applied last. See [order](/matrices/3d-transforms#order).

<Example src="projection" :height="320" />

<<< @/examples/projection.js

## The view matrix

`Mat4.lookAt(eye, center, up)` makes a view matrix for a camera at `eye`, looking at `center`, with `up` as the rough up direction. It's the inverse of the camera's own transform.

```js
const view = Mat4.lookAt([0, 2, 6], [0, 0, 0], [0, 1, 0])
```

To point an *object* at something, rather than set up a camera, use `Mat4.targetTo(eye, target, up)`. It places the object at `eye` with its -z axis facing `target`, and is the inverse of `lookAt`:

```js
const turret = Mat4.targetTo(turretPosition, enemyPosition, [0, 1, 0])
```

If the camera already has a transform, its inverse is the view matrix: `cameraMatrix.invertNew()`.

## Perspective

`Mat4.perspective(fovy, aspect, near, far)` makes distant things smaller, as an eye or a lens does.

- `fovy` is the vertical field of view in radians. `Math.PI / 4` (45°) is a common choice.
- `aspect` is the viewport's width divided by its height. Update it when the canvas resizes.
- `near` and `far` bound what's drawn. Keep `near` as large as you can, since depth precision is spread between them unevenly. Pass `Infinity` for `far` to draw everything beyond `near`.

`Mat4.frustum(left, right, bottom, top, near, far)` makes the same kind of matrix from the edges of the near plane, for off-centre projections.

## Orthographic

`Mat4.ortho(left, right, bottom, top, near, far)` keeps parallel lines parallel and sizes the same at every distance, which suits 2D scenes, isometric views, shadow maps and UI:

```js
// One unit per CSS pixel, with the origin at the top left
const projection = Mat4.ortho(0, width, height, 0, -1, 1)
```

## Clip space and the screen

All the projections are right-handed and map depth as WebGL expects, from -1 at the near plane to 1 at the far plane.

`Vec3.transformByMat4` divides by w, so transforming a point by the model-view-projection matrix gives normalised device coordinates directly. From there to the canvas is a scale and a flip of y:

```js
import { Vec2, Vec3 } from 'wtc-math'

function toScreen(point, mvp, width, height) {
  const ndc = point.transformByMat4New(mvp)
  return new Vec2((ndc.x + 1) * 0.5 * width, (1 - ndc.y) * 0.5 * height)
}
```

A point with an NDC z outside -1 to 1 is in front of the near plane or past the far one, and wouldn't be drawn.

## Related

- [3D transforms](/matrices/3d-transforms)
- [With WebGL and wtc-gl](/guides/webgl)
- [Ray](/geometry/ray), for picking with the pointer
- API: [Mat4](/api/wtc-math/classes/Mat4)
