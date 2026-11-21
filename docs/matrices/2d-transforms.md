# 2D transforms

Move, turn and stretch points on a plane with `Mat2` and `Mat3`. {.lead}

A `Mat2` holds a rotation, scale or shear: anything that keeps the origin where it is. A `Mat3` adds a translation, so one matrix can place a shape anywhere. Both are column-major, like every matrix in wtc-math (see [conventions](/getting-started/conventions#column-major-matrices)).

<Example src="mat3-transform" :height="340" />

<<< @/examples/mat3-transform.js

## Making a matrix

`new Mat3()` and `Mat3.identity()` both give the identity, which leaves points where they are. To set the elements yourself, pass them a column at a time:

```js
import { Mat2, Mat3 } from 'wtc-math'

// Scale x by 2 and y by 3
const scaling = new Mat2(
  2, 0, // first column
  0, 3 // second column
)

// The same, with a translation of (10, 20) in the third column
const placed = new Mat3(
  2, 0, 0,
  0, 3, 0,
  10, 20, 1
)
```

## Building up a transform

`translate(v)`, `rotate(radians)` and `scaleByVec2(v)` change the matrix in place and return it, so they chain:

```js
import { Vec2, Mat3 } from 'wtc-math'

const model = Mat3.identity()
  .translate(new Vec2(200, 120))
  .rotate(Math.PI / 4)
```

Each call multiplies on the right, so it happens *before* the ones you called earlier when the matrix is applied to a point. Read the chain from the bottom up: this matrix turns a point by 45° around the origin, then moves it to (200, 120). Swap the calls and the point is moved first, then swung around the origin.

`multiply(m)` works the same way: `a.multiply(b)` gives `a × b`, which applies `b` first.

::: tip
`scale(n)` multiplies every element by `n`, translation included, so it isn't a scaling transform. Use `scaleByVec2([sx, sy])` to stretch a shape along its own axes.
:::

## Applying it

Transform a `Vec2` with `transformByMat3`, which treats it as a point so the translation applies, or `transformByMat2` for a `Mat2`:

```js
const corner = new Vec2(1, 1).transformByMat3(model)
const turned = new Vec2(1, 0).transformByMat2(Mat2.identity().rotate(Math.PI / 2)) // (0, 1)
```

## Inverting

`invert()` undoes a transform. With the inverse of a shape's matrix you can take a point from the screen into the shape's own space, to test whether the pointer is inside it:

```js
const local = pointer.transformByMat3New(model.invertNew())
const inside = Math.abs(local.x) <= 1 && Math.abs(local.y) <= 1
```

`determinant` tells you whether a matrix can be inverted (anything but 0) and whether it mirrors (negative). `transpose`, `adjoint`, `add`, `subtract` and `multiplyScalar` are there too, each with a `New` form.

## Pixels to clip space

`Mat3.fromProjection(width, height)` maps pixel coordinates, with the origin at the top left and y pointing down, to WebGL's clip space from -1 to 1 with y pointing up. Multiply it on the left of a 2D model matrix to draw in pixels in a shader:

```js
const projection = Mat3.fromProjection(canvas.width, canvas.height)
const matrix = projection.multiplyNew(model)
// In the vertex shader: gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
```

## Related

- [3D transforms](/matrices/3d-transforms)
- [Vec2](/vectors/vec2)
- API: [Mat2](/api/wtc-math/classes/Mat2), [Mat3](/api/wtc-math/classes/Mat3)
