# Known issues

Bugs and allocation problems found while documenting the library, to fix in later releases. The TSDoc comments describe what the code does today, and the guides avoid the broken parts. Fixing one is a behaviour change, so each needs a changeset, a test, and an update to the comment that describes the current behaviour.

## Rotation direction

- **`Mat2.fromAngle` and `Mat3.fromAngle` turn the wrong way.** They build the transpose of a rotation, so `fromAngle(r)` equals `identity().rotate(-r)`: clockwise, where `Vec2.rotate` and `Mat2`/`Mat3.rotate` turn counter-clockwise.
- **`Mat3.fromQuat` rotates by the inverse of the quaternion.** It returns the transpose of `Mat4.fromQuat`'s upper 3×3. `new Vec3(1, 0, 0).transformByMat3(Mat3.fromQuat(q))` disagrees with `transformByQuat(q)`.

## Swizzle setters

The getters are right; these setters write the wrong components.

- **`Vec3.yzx` and `Vec3.zxy` are swapped**, and so are `Vec4.yzx` and `Vec4.zxy`. `v.yzx = [a, b, c]` sets x = b, y = c, z = a, where it should set y = a, z = b, x = c.
- **`Vec3.zy` and `Vec4.zy` write in reverse**: z = v.y and y = v.x, where it should be z = v.x and y = v.y.
- **`xx`, `yy` and `zz` (Vec2, Vec3) take their value from the second component** (`v.y`). Using the first would match the other setters.

## Vectors

- **The `lengthSquared` setter sets the wrong length** (Vec2, Vec3, Vec4). It scales by `value / lengthSquared`, so the new squared length is `value² / old`. It should scale by `Math.sqrt(value / lengthSquared)`.
- **Setting `length` or `lengthSquared` on a zero vector stores NaN**, which the getters then hide by reading it as 0.
- **`Vec3.cross` and `Vec4.cross` don't change the vector in place**, unlike every other method without the `New` suffix, so `cross` and `crossNew` do the same thing.
- **`Vec4.getAngle` returns the angle between two rotations**, `acos(2·dot² − 1)`, not the angle between two 4D vectors. It can also return NaN when rounding pushes the dot product just past 1.
- **`inverse` has no divide-by-zero guard** (Vec2, Vec3, Vec4): a zero component becomes `Infinity`, where `divide` gives 0.
- **`Vec2.slope`'s setter flips vectors that point left**, because it sets the angle to `Math.atan(value)`, which is always between -90° and 90°.
- **The x, y, z and w setters accept NaN** and store it; the getters hide it as 0.
- `Vec2.rotateDegByNew` names its parameter `radian`, though it takes degrees.

## Matrices

- **`Mat4.transformToNew` adds to the translation instead of setting it.** It calls `transform` rather than `transformTo`.
- **`Mat4.rotation` is only right for a uniform scale.** It divides each row by a scale factor where it should divide each column by its own. The same bug is in gl-matrix.
- **`Mat2.columnArray` and `Mat3.columnArray` are row-major.** `array` is already column-major; `columnArray` returns the transpose.
- **`invert` leaves a singular matrix unchanged without saying so** (Mat2, Mat3, Mat4), where `Mat3.fromMat4` returns null for the same case.
- `Mat4.fromRotation` types its `axis` as `any` rather than `Vec3Like`, and `Mat3.translate` takes a `Vec2` rather than a `Vec2Like` and has no `translateNew`.

## Quaternions

- **`Quat.inverse()`, inherited from Vec4, takes the reciprocal of each component**, which is easy to confuse with `invert()`. `Quat.lerp`, `Quat.interpolate` and `cross` return a `Vec4` rather than a `Quat`.
- `Quat.rotateX`, `rotateY` and `rotateZ` ignore their `origin` argument, which is there only to match Vec4.

## Color

- **`Color.fromHSV` throws on a negative hue**: `i % 6` is negative, so the lookup is undefined.
- **`Color.fromHex` misreads 4- and 8-digit hex** rather than reading the alpha or rejecting it (`'#ff000080'` comes out bluish with alpha 1). Strings that aren't hex give black, and since `ColorLike` strings go through `fromHex`, CSS strings such as `'rgb(…)'` aren't supported.
- **`toHex` and `toCSS` don't clamp**, so a channel outside 0–1 gives a broken hex string or an out-of-range `rgb()` value.

## Plane and Ray

- **`Ray.intersectBox` returns null when the ray starts inside the box**, where `intersectSphere` returns the exit point. A ray with a zero component whose origin lies exactly on a slab plane gives 0/0 = NaN.
- `Plane`'s constructor doesn't normalise the normal, so `distanceTo` and `projectPoint` are wrong for a non-unit normal unless you call `normalize()`.

## Allocation in per-frame methods

Many methods documented as "in place" still allocate temporary objects, which adds garbage-collection pressure in render loops. wtc-gl works around this with its own allocation-free copies in `packages/wtc-gl/src/core/matrix.ts`; once these are fixed it can drop that file. Benchmark before and after (Vitest's `bench`) so the gains are measured, not assumed.

### Internal temporaries (no API change)

These can use local numbers instead of temporary objects, with identical results:

- **Scalar arithmetic** (Vec2, Vec3, Vec4): `addScalar`, `subtractScalar`, `multiplyScalar` and `divideScalar` each build a temporary vector, and `scale` and `normalise` go through them. `v.normalise().scale(10)` allocates two vectors.
- **`transformByMat2`, `transformByMat3`, `transformByMat4`** (Vec2, Vec3, Vec4) clone the vector and read the matrix's `.array`, which builds a new array of up to 16 numbers. Transforming 1,000 points allocates 2,000 objects. They can read the matrix's elements directly.
- **`transformByQuat`** (Vec3, Vec4) clones the vector and builds two temporary vectors.
- **`rotateX`, `rotateY` and `rotateZ`** (Vec3, Vec4) call `subtractNew`, and **`distance`** calls `subtractNew` to measure a length.
- **Matrix `multiply`, `rotate`, `invert` and `adjoint`** (Mat2, Mat3, Mat4) clone the matrix first. `Mat4.rotate` also builds a second Mat4. A clone runs the constructor and all 16 type-checked setters.
- **`Quat.multiply` and `Quat.rotateX`, `rotateY`, `rotateZ`** clone the quaternion.
- **`Plane` and `Ray`** run every point through `Vec3.interpolate`, which allocates a Vec3 even when given one, then use `subtractNew`, `addNew` and `multiplyScalarNew` along the way. They could read x, y and z from the `Vec3Like` directly.
- **`Vec2.getAngle`, `Vec3.getAngle` and `Vec4.getAngle`** clone both vectors to normalise them, where they could divide the dot product by the two lengths.

### New allocation-free API (additive)

The common per-frame operations need forms that write into an object you already have:

- **Writing to a typed array:** `toArray(out, offset = 0)` on vectors, quaternions, matrices and `Color`, so uniforms can be filled without making a new array each frame (wtc-gl's `writeMat4` and `writeMat3`).
- **Multiplying two matrices into this one:** `multiplyMatrices(a, b)` (or a static `Mat4.multiply(out, a, b)`), for model-view-projection and parent-child chains without `multiplyNew`.
- **Composing in place:** `Mat4.compose(q, position, scale)`, the in-place counterpart of `fromRotationTranslationScale` (wtc-gl's `composeMat4`).
- **Decomposing into existing objects:** `getTranslation(out)`, `getScaling(out)` and `getRotation(out)`, since the `translation`, `scaling` and `rotation` getters allocate.
- **In-place interpolation:** `lerp(v, t)` on vectors and `slerp(q, t)` on Quat, since `Vec*.lerp` and `Quat.slerp` are static and allocate. `Color` already has an in-place `lerp`.
- **Setting from loose values without allocating:** a `set(x, y, z)` / `copy(v)` pair (`reset` and `resetToVector` exist, but `resetToVector` silently ignores anything that isn't the same class), and `Quat.setFromAxisAngle` and `setFromEuler` (wtc-gl's `quatFromEuler`).
- **A normal matrix into an existing Mat3:** `Mat3.normalFromMat4(m)`, the in-place counterpart of `fromMat4` (wtc-gl's `normalMatrix`).

### Field access (measure first)

Every component read goes through a getter that does `this.#x || 0`, and every write through a setter that type-checks and can throw. That isn't allocation, but it is the cost on every operation. Plain public fields, or a `Float32Array`/`Float64Array` backing store (which would also make `toArray` a single `set`), would be faster. This changes behaviour, though: NaN would be visible, bad values wouldn't throw, and a typed array changes precision or what `.array` returns. It needs a benchmark and probably a major version.

## Scalar functions

- `pingpong` returns negative values for a negative `t`, because `%` keeps the sign.
- `map` divides by zero when `inMin === inMax`, and `smoothstep` and `smootherstep` return NaN when `edge0 === edge1`.
