# Plane

A `Plane` is a flat surface that goes on forever, given by the direction it faces and its distance from the origin. {.lead}

```js
import { Plane } from 'wtc-math/plane'

const ground = new Plane([0, 1, 0], 0) // the xz plane, facing up
```

`Plane` has an entry point of its own, `wtc-math/plane`. It has a `normal`, the `Vec3` it faces, and a `constant`. A point `p` is on the plane when `normal.dot(p) + constant` is 0, so for a unit normal the constant is the negative of the plane's distance from the origin along it. Without arguments the plane faces up through the origin.

<Example src="plane-distance" :height="320" />

<<< @/examples/plane-distance.js

## Making one

Usually it's easier to make a plane from a point on it, or from three points:

```js
// Facing up, 2 units above the origin
const floor = Plane.fromNormalAndPoint([0, 1, 0], [0, 2, 0]) // constant -2

// Through three points; the normal follows the right-hand rule a → b → c
const face = Plane.fromPoints(a, b, c)
```

Both normalise the normal for you. The constructor doesn't, so pass it a unit normal, or call `normalize()` afterwards, which scales the normal and the constant together. `negate()` flips the plane to face the other way.

## Distance and projection

`distanceTo(point)` gives the signed distance from the plane: positive on the side the normal points to, negative behind it, 0 on the plane. That makes it a test for which side of a wall something is on:

```js
floor.distanceTo([0, 5, 0]) // 3
floor.distanceTo([0, 0, 0]) // -2
```

`projectPoint(point)` gives the nearest point on the plane, by moving the point along the normal:

```js
floor.projectPoint([3, 5, 1]) // Vec3(3, 2, 1)
```

## Intersecting a line

`intersectLine(start, end)` gives the point where the segment from `start` to `end` crosses the plane, or null if it doesn't reach it or runs parallel to it:

```js
floor.intersectLine([0, 0, 0], [0, 4, 0]) // Vec3(0, 2, 0)
floor.intersectLine([0, 3, 0], [0, 4, 0]) // null: both ends are above
```

For a line that goes on forever, use [`Ray.intersectPlane`](/geometry/ray#intersections).

## Related

- [Ray](/geometry/ray)
- [Vec3](/vectors/vec3)
- API: [Plane](/api/wtc-math/plane/classes/Plane)
