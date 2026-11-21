# Vec2

A two-dimensional vector, for positions, directions, sizes and velocities on a plane. {.lead}

Make one with an x and a y. Both default to 0:

```js
import { Vec2 } from 'wtc-math'

const position = new Vec2(120, 80)
const origin = new Vec2() // (0, 0)
```

`x` and `y` are read and written directly. `width` and `height` are the same two values under other names, for when a `Vec2` holds a size, and `area` is their product.

## Arithmetic

`add`, `subtract`, `multiply` and `divide` work component by component with another `Vec2`. Each has a `Scalar` form that applies one number to both components. `scale(n)` is the same as `multiplyScalar(n)`.

```js
const a = new Vec2(1, 2)

a.add(new Vec2(3, 4)) // (4, 6)
a.multiplyScalar(2) // (8, 12)
a.divide(new Vec2(4, 0)) // (2, 0): dividing by 0 gives 0, not Infinity
```

All of these change `a` in place. Add `New` for a copy: `a.addNew(b)`. See [in place, or new](/getting-started/conventions#in-place-or-new).

`negate` flips the direction, and `inverse` takes `1 / x` and `1 / y`. `floor`, `ceil`, `round` and `fract` apply to both components, and `mod(v)` takes the remainder by another vector, which suits wrapping a position around the edges of a canvas:

```js
position.add(velocity).mod(new Vec2(width, height))
```

## Length and direction

`length` is the vector's magnitude. Set it to change the magnitude while keeping the direction:

```js
const v = new Vec2(3, 4)
v.length // 5

v.length = 10 // (6, 8)
v.normalise() // (0.6, 0.8), length 1
```

`normalise` keeps the direction and sets the length to 1. A zero vector stays zero. `lengthSquared` skips the square root, so use it to compare lengths:

```js
if (a.subtractNew(b).lengthSquared < radius * radius) {
  // a is within radius of b
}
```

`distance(v)` gives the distance to another point, and `distanceX` and `distanceY` the distance along each axis.

## Angles and rotation

`angle` is the direction the vector points, in radians, from `Math.atan2(y, x)`. `angleInDegrees` is the same in degrees. Setting either turns the vector to face that way, keeping its length.

`rotate(radians)` turns the vector by an angle, and `rotateTo(radians)` turns it to face one. Both have degree forms, `rotateDeg` and `rotateToDeg`:

```js
const v = new Vec2(1, 0)

v.rotate(Math.PI / 2) // (0, 1)
v.rotateToDeg(180) // (-1, 0)
```

Positive angles turn counter-clockwise with y up, which is clockwise on a canvas where y points down.

`Vec2.getAngle(a, b)` gives the angle between two vectors, from 0 to π, whatever their lengths.

## Dot and cross products

`dot(v)` multiplies the vectors' lengths by the cosine of the angle between them. With a unit vector, it gives how far the other vector reaches in that direction, which is how you project one vector onto another:

<Example src="vec2-projection" :height="340" />

<<< @/examples/vec2-projection.js

The dot product is positive when the vectors point the same way, zero when they're at right angles and negative when they point apart, which makes it a quick test for whether something is in front of or behind you.

`cross(v)` gives the 2D cross product, a single number: positive when `v` is counter-clockwise of this vector, negative when it's clockwise. `det(v)` is the same value.

## Interpolation

`Vec2.lerp(a, b, t)` returns a new vector `t` of the way from `a` to `b`:

```js
const halfway = Vec2.lerp(start, end, 0.5)

// Ease towards a target each frame
position = Vec2.lerp(position, target, 0.1)
```

## Matrices

`transformByMat2(m)` multiplies the vector by a 2×2 matrix, and `transformByMat3(m)` by a 3×3 matrix, treating the vector as a point so the matrix's translation applies. See [2D transforms](/matrices/2d-transforms).

## Related

- [Vec3](/vectors/vec3), [Swizzling](/vectors/swizzling)
- [Conventions](/getting-started/conventions)
- API: [Vec2](/api/wtc-math/classes/Vec2), [Vec2Like](/api/wtc-math/type-aliases/Vec2Like)
