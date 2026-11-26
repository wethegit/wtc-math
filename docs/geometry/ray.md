# Ray

A `Ray` starts at a point and runs forever in one direction. Cast one to find what it hits. {.lead}

```js
import { Ray } from 'wtc-math/ray'

const ray = new Ray([0, 1, 5], [0, 0, -1])
```

`Ray` has an entry point of its own, `wtc-math/ray`. It has an `origin` and a `direction`, both `Vec3`s. The direction is normalised when the ray is made, so distances along it are in world units. Without arguments a ray starts at the origin and points down -z.

<Example src="ray-cast" :height="360" />

<<< @/examples/ray-cast.js

## Points along a ray

`at(t)` gives the point `t` units along the ray:

```js
ray.at(2) // Vec3(0, 1, 3)
```

`closestPoint(p)` gives the point on the ray nearest to `p`, and `distanceTo(p)` the distance between them. Neither looks behind the origin: for a point behind it, the closest point is the origin itself.

## Intersections

Each intersection method returns the point where the ray first meets the shape, as a new `Vec3`, or null if it misses:

- `intersectSphere(centre, radius)` hits a sphere. From inside the sphere it returns the point where the ray leaves.
- `intersectBox(min, max)` hits an axis-aligned box given by its opposite corners. From inside the box it returns the point where the ray leaves.
- `intersectPlane(plane)` hits a [`Plane`](/geometry/plane). It returns null when the ray runs parallel to the plane or points away from it.

```js
import { Ray } from 'wtc-math/ray'
import { Plane } from 'wtc-math/plane'

const ray = new Ray([0, 0, 5], [0, 0, -1])

ray.intersectSphere([0, 0, 0], 1) // Vec3(0, 0, 1)
ray.intersectBox([-1, -1, -1], [1, 1, 1]) // Vec3(0, 0, 1)
ray.intersectPlane(new Plane([0, 0, 1], 0)) // Vec3(0, 0, 0)
ray.intersectSphere([5, 0, 0], 1) // null
```

To find the nearest of several hits, compare their distances from the origin, as the example does.

## Picking with the pointer

To find what's under the pointer in a 3D scene, cast a ray from the camera through the pointer. Take the pointer to normalised device coordinates, then back through the inverse of the view-projection matrix at the near and far planes:

```js
import { Vec3 } from 'wtc-math'
import { Ray } from 'wtc-math/ray'

function pointerRay(x, y, width, height, viewProjection) {
  const ndcX = (x / width) * 2 - 1
  const ndcY = 1 - (y / height) * 2
  const inverse = viewProjection.invertNew()
  const near = new Vec3(ndcX, ndcY, -1).transformByMat4(inverse)
  const far = new Vec3(ndcX, ndcY, 1).transformByMat4(inverse)
  return new Ray(near, far.subtract(near))
}
```

## Related

- [Plane](/geometry/plane)
- [Cameras and projection](/matrices/projection)
- API: [Ray](/api/wtc-math/ray/classes/Ray)
