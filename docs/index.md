---
title: Introduction
---

# Introduction

wtc-math is a small maths library for graphics and creative coding: vectors, matrices, quaternions, colours, and the scalar helpers you reach for in every sketch. {.lead}

It has no dependencies and works anywhere JavaScript does. The vectors and matrices are laid out the way WebGL expects, so a value goes straight into a shader uniform, and [wtc-gl](https://wethegit.github.io/wtc-gl/docs/) re-exports the whole library.

<Example src="intro" :height="320" />

<<< @/examples/intro.js

## What's in it

- **Vectors.** [`Vec2`](/vectors/vec2), [`Vec3`](/vectors/vec3) and [`Vec4`](/vectors/vec4), with arithmetic, length and angle, dot and cross products, rotation, interpolation and [swizzling](/vectors/swizzling).
- **Matrices.** `Mat2`, `Mat3` and `Mat4`, column-major, for [2D](/matrices/2d-transforms) and [3D](/matrices/3d-transforms) transforms, and [cameras and projection](/matrices/projection).
- **Rotation.** [`Quat`](/rotation/quaternions) for rotations without gimbal lock, from an axis and angle or Euler angles, with spherical interpolation.
- **Geometry.** [`Plane`](/geometry/plane) and [`Ray`](/geometry/ray), for distances, projections and intersections.
- **Colour.** [`Color`](/colour/color), an RGBA colour with conversions to and from hex, HSL, HSV, [OKLab and OKLCH](/colour/colour-spaces), and [perceptual gradients](/colour/gradients).
- **Utilities.** [`clamp`, `lerp`, `map`, `smoothstep`](/utilities/scalars) and friends.

## A first look

```js
import { Vec2, Vec3, Mat4, Quat, lerp } from 'wtc-math'

// Vectors change in place and return themselves, so calls chain
const velocity = new Vec2(3, 4)
velocity.normalise().scale(10) // Vec2(6, 8)

// Methods ending in New leave the vector alone and return a new one
const position = new Vec2(0, 0)
const next = position.addNew(velocity) // position is still (0, 0)

// Build a model matrix from a rotation, translation and scale
const rotation = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
const model = Mat4.fromRotationTranslationScale(
  rotation,
  [0, 1, 0],
  [2, 2, 2]
)

// And transform a point by it
const point = new Vec3(1, 0, 0).transformByMat4(model)
```

Start with [installation](/getting-started/installation), then read the [conventions](/getting-started/conventions) the whole library follows.
