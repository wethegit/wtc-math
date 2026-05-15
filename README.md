# [wtc-math](https://github.com/wethegit/wtc-math#readme) _1.3.0_

> A math library for JavaScript and TypeScript — vectors, matrices, quaternions, and utilities for 3D graphics and creative coding.

## Install

```bash
npm install wtc-math
```

## Usage

The core classes are available from the main entry point:

```ts
import { Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, Quat } from "wtc-math";
import { clamp, lerp, map, smoothstep, degToRad } from "wtc-math";
```

`Color`, `Plane`, and `Ray` are optional — import them only when needed:

```ts
import { Color } from "wtc-math/color";
import { Plane } from "wtc-math/plane";
import { Ray }   from "wtc-math/ray";
```

## Classes

| Class | Description |
|-------|-------------|
| `Vec2` | 2D vector |
| `Vec3` | 3D vector |
| `Vec4` | 4D vector |
| `Mat2` | 2×2 matrix |
| `Mat3` | 3×3 matrix |
| `Mat4` | 4×4 matrix |
| `Quat` | Quaternion (extends Vec4) |
| `Color` | RGBA colour in 0–1 space — `fromHex`, `fromHSL`, `lerp`, `toCSS` |
| `Plane` | Plane in 3D — `distanceTo`, `projectPoint`, `intersectLine` |
| `Ray`   | Ray in 3D — `at`, `intersectSphere`, `intersectBox`, `intersectPlane` |

## Utilities

```ts
clamp(v, min, max)
lerp(a, b, t)
map(v, inMin, inMax, outMin, outMax)
smoothstep(edge0, edge1, x)
smootherstep(edge0, edge1, x)
degToRad(deg)
radToDeg(rad)
pingpong(t, length)
```

## Types

All structural types are exported:

```ts
import type { Vec2Like, Vec3Like, Vec4Like, QuatLike, Mat2Like, Mat3Like, Mat4Like } from "wtc-math";
```

## Documentation

Full API docs: [wethegit.github.io/wtc-math](https://wethegit.github.io/wtc-math/)
