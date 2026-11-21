# Roadmap

Planned work on wtc-math, roughly in the order it should happen. Bugs and the allocation problems in existing methods are listed separately in [KNOWN-ISSUES.md](KNOWN-ISSUES.md).

## Order of work

1. **Tests first.** Add a failing regression test for each item in [KNOWN-ISSUES.md](KNOWN-ISSUES.md) before fixing it, and benchmarks (Vitest's `bench`) for the hot paths: `normalise`, transforming a batch of points, and a parent-child matrix chain.
2. **Bug fixes and allocation work** from [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
3. **New features**, below. They should follow the allocation-free pattern from step 2: methods that change `this`, `New` variants that allocate, and statics that take an optional `out`.
4. **Package and tooling** updates can happen any time, each in its own PR.

Each change to the published package needs a changeset (`npm run changeset`) and docs: TSDoc on every new export (the docs build fails without it) and a guide page or section for anything a reader would look for.

## Package and tooling

### Package

- **Move `typescript` from `dependencies` to `devDependencies`.** It's published as a runtime dependency (1.4.0 lists `typescript: ^6.0.3`), so every install of wtc-math also installs TypeScript. Nothing uses it at runtime.
- **Add `"sideEffects": false`** to `package.json`. No module in `src/` runs anything when imported, so bundlers can drop what a project doesn't use.
- **Update the metadata.** The `description` only mentions vectors, matrices and quaternions; add colours, `Plane`, `Ray` and the scalar functions. Point `homepage` at the docs site, [wethegit.github.io/wtc-math](https://wethegit.github.io/wtc-math/), and add keywords such as colour, OKLCH, ray and plane.
- **Change `husky install` to `husky`** in the `prepare` script. `husky install` is deprecated in husky v9 and prints a warning.
- **Release a patch** for the above. npm only shows the new README after a release.

### Code style

- **Add Prettier and ESLint**, configured as in wtc-gl, with lint-staged in the pre-commit hook. `src/` mixes `var`, double quotes and tabs. Reformat everything in one PR of its own, before or after the bug fixes but not mixed in with them, so the fix diffs stay readable. Add the commit to `.git-blame-ignore-revs`.
- **Merge `src/common.ts` into `Utils.ts`.** It duplicates `degToRad` and `radToDeg` as `degreesToRadian` and `radianToDegrees`.
- **Trim `tsdoc.json`.** The `@chainable`, `@constructor` and `@static` tag definitions are no longer used.

### CI

- **Bring `docs.yml` in line with `release.yml`**: `npm ci` with the npm cache instead of `npm install`, and current versions of the checkout, setup-node and Pages actions.
- **Check `dependabot.yml`'s `reviewers` setting**, which GitHub may have deprecated in favour of a `CODEOWNERS` file, and switch to `CODEOWNERS` if so.

### wtc-gl

- **Point wtc-gl's API links at the new reference.** Its TypeDoc `externalSymbolLinkMappings` send every wtc-math type to the site root; map them to the class pages instead, such as `https://wethegit.github.io/wtc-math/api/wtc-math/classes/Vec3`. Its `api/wtc-math.md` page could link to the [conventions](https://wethegit.github.io/wtc-math/getting-started/conventions) guide.
- **Delete `core/matrix.ts`** once wtc-math's in-place methods stop allocating and it has `multiplyMatrices`, `compose`, `toArray` and the rest of the allocation-free API.

## New features

### From wtc-gl

wtc-gl implements these itself. Moving them here lets it delete the code, and makes them available to projects that don't use wtc-gl.

- **`Frustum`**: six planes from a view-projection matrix, with `setFromMatrix(m)`, `intersectsSphere(centre, radius)`, `intersectsBox(min, max)` and `containsPoint(p)`. Replaces `Camera.updateFrustum`, `setPlane`, `planeDistance` and `frustumIntersectsSphere` in wtc-gl.
- **`Box3` and `Sphere` bounds**: build from points, `expandByPoint`, `containsPoint`, `intersectsBox` and `intersectsSphere`, centre and size, and `applyMat4(m)`. Replaces wtc-gl's `core/bounds.ts` (`worldBoundingSphere`) and `Raycast`'s private `boxDistance`.
- **A fuller `Ray`**:
  - Return the hit distance `t` as well as the point, or add `intersect…Distance` methods, since sorting hits needs the distance. wtc-gl's `Raycast` returns distances.
  - `intersectTriangle(a, b, c, cullBackFaces)` using Möller–Trumbore, as wtc-gl's `Raycast` does.
  - `applyMat4(m)`, to take a ray into a model's local space.
  - `Ray.fromCamera(ndc, inverseViewProjection)`. The [Ray guide](docs/geometry/ray.md#picking-with-the-pointer) currently has readers write this by hand.
- **`Vec3.project(viewProjection)` and `Vec3.unproject(inverseViewProjection)`**, matching wtc-gl's `Camera.project` and `Camera.unproject`.
- **sRGB and linear colour**: `Color.toLinear()` and `Color.fromLinear(r, g, b, a)`. `Color` already converts internally for OKLab, and wtc-gl does it again in `loaders/gltf/colour.ts`. Lighting maths and shaders work in linear colour.
- **Curve evaluation**: point and derivative at `t` for quadratic and cubic Béziers and Catmull-Rom splines, as plain functions. wtc-gl's `path/segments.ts` has its own. Its `Path` class, with tilt and frames, is renderer-specific and stays in wtc-gl.

### Creative coding

- **Frame-rate-independent damping**: `damp(a, b, lambda, dt)`, with `Vec2`, `Vec3`, `Vec4` and `Quat` versions, and a critically damped spring like Unity's `SmoothDamp` that keeps a velocity. Once it exists, update the docs that suggest `lerp(x, target, 0.1)` each frame ([Vec2](docs/vectors/vec2.md#interpolation), [scalar functions](docs/utilities/scalars.md#lerp)), which settles faster on a 120 Hz screen than a 60 Hz one.
- **Noise**: seeded simplex noise in 2D, 3D and 4D, and fractal (fBm) noise built on it.
- **Seeded randomness**: a small seeded generator (such as mulberry32), `randomRange`, and random points in and on a circle and a sphere.
- **Easing functions**: in, out and in-out forms of quad, cubic, quart, expo, sine, back and elastic.
- **More scalar functions**:
  - `inverseLerp(a, b, v)`.
  - A `mod` that's always positive. Use it in `pingpong`, which fixes the negative `t` bug.
  - `fract`, `step`, `wrap(v, min, max)` and `approxEqual(a, b, epsilon)`.
  - `lerpAngle` and `angleDelta`, which take the shortest way around the circle, so a turn from 350° to 10° doesn't go the long way.
- **Vector operations GLSL has and wtc-math lacks**:
  - `reflect(normal)` and `refract(normal, eta)`.
  - Component-wise `min`, `max`, `clamp` and `abs`.
  - `equals(v, epsilon)`.
  - `projectOnto(v)` and `projectOnPlane(normal)`.
  - `Vec2.fromAngle(angle, length)`.
  - Spherical and cylindrical conversion. Today `radius`, `phi` and `theta` are only other names for x, y and z.
- **Quaternions**:
  - `Quat.fromUnitVectors(a, b)`, the rotation that turns one direction into another, for aligning an object to a normal or a velocity.
  - `Quat.lookRotation(forward, up)`.
  - `toEuler(order)` and `toAxisAngle()`.
  - `rotateTowards(q, maxAngle)`.

### Web

- **CSS transforms**: `Mat4.toCSS()` giving `matrix3d(…)` and `Mat3.toCSS()` giving `matrix(…)`, for driving DOM elements from a camera or a 2D transform.
- **CSS colours**:
  - `toCSS('oklch')` and the other modern formats.
  - `Color.fromCSS(string)` to parse `rgb()`, `hsl()`, `oklch()` and 3-, 4-, 6- and 8-digit hex. This also fixes `fromHex` misreading 8-digit hex, and lets `ColorLike` strings be any CSS colour.
- **Accessibility**: WCAG `luminance()` and `Color.contrastRatio(a, b)`, for checking text against a background.
- **Palette adjustments in OKLCH**: `lighten`, `darken`, `saturate`, `desaturate` and `withAlpha`.
- **Gamut mapping**: bring out-of-gamut OKLCH colours into sRGB by reducing chroma rather than clipping each channel, so `fromOklch` stops shifting hue at the extremes. The [colour spaces guide](docs/colour/colour-spaces.md#oklab-and-oklch) warns about this today.
- **Reading from typed arrays**: `fromArray(array, offset)` on vectors, quaternions, matrices and `Color`, the counterpart of the `toArray(out, offset)` planned in [KNOWN-ISSUES.md](KNOWN-ISSUES.md#new-allocation-free-api-additive). For reading geometry attributes and buffers.
