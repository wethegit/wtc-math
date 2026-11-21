# [wtc-math](https://github.com/wethegit/wtc-math#readme)

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

[The documentation](https://wethegit.github.io/wtc-math/) has guides, live examples and the API reference.

## Development

| Command | What it does |
| --- | --- |
| `npm run docs:dev` | Generates the API pages and starts the docs site. |
| `npm run docs:build` | Builds the docs for GitHub Pages. |
| `npm test` | Runs the tests. |
| `npm run check` | Type-checks, tests and builds. This is what CI runs. |

The docs are in `docs/`; [docs/README.md](docs/README.md) covers writing pages and examples. The API reference is generated from the TSDoc comments in `src/`, and the docs build (and the pre-commit hook) fail on an undocumented export.

Bugs found but not yet fixed are listed in [KNOWN-ISSUES.md](KNOWN-ISSUES.md), and planned work in [ROADMAP.md](ROADMAP.md).
