# With WebGL and wtc-gl

wtc-math's vectors, matrices and colours are laid out the way WebGL expects, so they go straight into shader uniforms. {.lead}

## Passing values to a shader

Every vector, matrix and colour has an `.array` getter with its values in the order GLSL reads them. Matrices are column-major, so there's nothing to transpose:

```js
import { Vec3, Mat4 } from 'wtc-math'
import { Color } from 'wtc-math/color'

const projection = Mat4.perspective(Math.PI / 4, width / height, 0.1, 100)

gl.uniformMatrix4fv(projectionLocation, false, projection.array)
gl.uniform3fv(lightLocation, new Vec3(1, 2, 3).normalise().array)
gl.uniform4fv(colourLocation, Color.fromHex('#ff8800').array)
```

`.array` returns a new array each time, so read it once per frame rather than once per draw if you're drawing many objects with the same value.

## In wtc-gl

[wtc-gl](https://wethegit.github.io/wtc-gl/docs/) re-exports wtc-math, so the same classes come from either import, and its cameras and objects use them for positions, rotations and matrices:

```js
import { Camera, Uniform, Vec2, Vec3 } from 'wtc-gl'

const camera = new Camera({ fov: 35 })
camera.position.reset(0, 2, 6)
camera.lookAt(new Vec3(0, 0, 0))
```

A wtc-gl `Uniform` takes plain values, so pass a vector's or matrix's `.array`:

```js
const u_pointer = new Uniform({
  name: 'pointer',
  value: new Vec2(0, 0).array,
  kind: 'float_vec2'
})

addEventListener('pointermove', (e) => {
  u_pointer.value = new Vec2(e.clientX / innerWidth, 1 - e.clientY / innerHeight).array
})
```

wtc-gl's [uniforms guide](https://wethegit.github.io/wtc-gl/docs/core/uniforms) covers kinds, arrays and textures.

## Matching GLSL

Much of wtc-math has a GLSL counterpart, so maths you prototype on the CPU carries over to a shader:

| wtc-math                                  | GLSL                                     |
| ----------------------------------------- | ---------------------------------------- |
| `a.dot(b)`                                | `dot(a, b)`                              |
| `a.cross(b)` on `Vec3`                    | `cross(a, b)`                            |
| `v.length`, `v.normaliseNew()`            | `length(v)`, `normalize(v)`              |
| `v.floorNew()`, `v.fractNew()`            | `floor(v)`, `fract(v)`                   |
| `clamp`, `smoothstep`, `smootherstep`     | `clamp`, `smoothstep`, and Perlin's curve |
| `lerp(a, b, t)`, `Vec3.lerp(a, b, t)`     | `mix(a, b, t)`                           |
| `v.xy`, `v.zxy` and other swizzles        | `v.xy`, `v.zxy`                          |
| `m.multiplyNew(n)`                        | `m * n`                                  |
| `v.transformByMat4(m)` on `Vec4`          | `m * v`                                  |

## Clip space

`Mat4.perspective`, `Mat4.ortho` and `Mat4.frustum` map depth to -1 at the near plane and 1 at the far plane, as WebGL does. [Cameras and projection](/matrices/projection) covers them, and `Mat3.fromProjection` does the same job for 2D drawing in pixels: see [2D transforms](/matrices/2d-transforms#pixels-to-clip-space).
