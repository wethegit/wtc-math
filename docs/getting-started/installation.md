# Installation

Install wtc-math from npm and import what you need. {.lead}

```sh
npm install wtc-math
```

wtc-math is an ES module with TypeScript declarations included. It has no dependencies.

## Importing

The vectors, matrices, quaternion and scalar functions come from the main entry point:

```js
import { Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, Quat } from 'wtc-math'
import { clamp, lerp, map, smoothstep, degToRad } from 'wtc-math'
```

`Color`, `Plane` and `Ray` have entry points of their own, so a project that doesn't use them doesn't bundle them:

```js
import { Color } from 'wtc-math/color'
import { Plane } from 'wtc-math/plane'
import { Ray } from 'wtc-math/ray'
```

## Types

The library is written in TypeScript. Alongside the classes it exports the `…Like` types that many methods accept, so your own functions can take the same inputs:

```ts
import type { Vec2Like, Vec3Like, QuatLike, Mat4Like } from 'wtc-math'
import type { ColorLike } from 'wtc-math/color'

function moveTo(target: Vec3Like) {
  // [x, y, z] or { x, y, z }
}
```

[Conventions](/getting-started/conventions#like-types) explains where they're accepted.

## With wtc-gl

[wtc-gl](https://wethegit.github.io/wtc-gl/docs/) re-exports wtc-math, so in a wtc-gl project you can import the maths from either package:

```js
import { Renderer, Vec2, Mat4 } from 'wtc-gl'
```

[With WebGL and wtc-gl](/guides/webgl) covers passing values to shaders.

## From a CDN

For a quick sketch without a bundler, import the module from a CDN that serves npm packages:

```html
<script type="module">
  import { Vec2 } from 'https://esm.sh/wtc-math'

  console.log(new Vec2(3, 4).length) // 5
</script>
```
