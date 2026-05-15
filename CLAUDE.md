# wtc-math

A TypeScript math library providing Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, and Quat classes.

## Build

```bash
npm run build        # Vite build (replaced microbundle)
npx tsc --noEmit     # Type-check only
```

## TypeScript type improvements — completed

All `any` parameters on public methods replaced with proper named types. Types live in `src/types.ts` using structural typing to avoid circular import issues.

**`src/types.ts`**
- `Vec2Like = { x: number; y: number } | [number, number]`
- `Vec3Like = { x: number; y: number; z: number } | [number, number, number]`
- `Vec4Like = { x: number; y: number; z: number; w: number } | [number, number, number, number]`
- `QuatLike = Vec4Like` (shared alias)
- `Mat2Like = Mat3Like = Mat4Like = { array: number[] } | number[]`

**`src/Vec2.ts`** — `Vec2Like` on swizzle setters `yx`, `xx`, `yy`; `Mat2Like`/`Mat3Like` on transform methods; `static interpolate` → `Vec2Like | number | string`.

**`src/Vec3.ts`** — `Vec3Like` on swizzles `xyz`, `yzx`, `zxy` and `static interpolate`; `Vec2Like` on 2-component swizzles; `QuatLike` on `transformByQuat`; `Mat3Like`/`Mat4Like` on transform methods; `Mat4Like` on `fromRotationMatrix`.

**`src/Vec4.ts`** — `Vec4Like` on 4-component swizzles and `static interpolate`; `Vec3Like` on 3-component swizzles; `Vec2Like` on 2-component swizzles; `QuatLike` on `transformByQuat`; `Mat4Like` on transform methods. `V4Q` interface updated throughout.

**`src/Mat2.ts`** — `Vec2Like` on `scaleByVec2`, `scaleByVec2New`, `fromScalingVec2`.

**`src/Mat3.ts`** — `Vec2Like` on `scaleByVec2`, `scaleByVec2New`, `fromScalingVec2`; `QuatLike` on `fromQuat`.

**`src/Mat4.ts`** — `Vec3Like` on all vec3 params (`scaleByVec3`, `transform`, `translate`, `rotate` axis, `lookAt`, `targetTo`, `fromScalingVec3`, `fromTranslatingVec3`, `fromRotationTranslationScale`, `fromRotationTranslationScaleOrigin`); `QuatLike` on `fromQuat`, `fromRotationTranslationScale`, `fromRotationTranslationScaleOrigin`.

**`src/Quat.ts`** — `Vec3Like` on `fromEuler` euler param.

Note: `orDefault` helpers in Mat files still typed `any` — these are internal and not worth typing.
Note: `Mat4.fromRotation` axis param still typed `any` — not in scope above.

---

## Known bugs (found in review, not yet fixed)

### Vec2.ts
- **`det` (L528)**: wrong sign — `+` should be `-`. Correct: `this.x * vector.y - this.y * vector.x`.
- **`cross` (L549)**: wrong formula — `this.x * vector.x - this.y * vector.y` is meaningless; should be `this.x * vector.y - this.y * vector.x`.

### Vec3.ts
- **`reset` (L40)**: destructures unused `w` variable (Vec3 has no w).
- **`z` setter error message (L667)**: says `"Y should be a number"` — should be `"Z"`.
- **`rotateX` (L308–309)**: clobber bug — writes `rotated.y` on L308, then reads the already-modified value to compute `rotated.z` on L309.
- **`rotateY` (L331)**: two bugs — `rotated.z * s + rotated.z * c` uses `z` twice (never reads `x`); L332 then reads the already-overwritten `rotated.x`.
- **`rotateZ` (L354–355)**: clobber bug — writes `rotated.x` on L354, reads it on L355 to compute `rotated.y`.
- **`rotateyNew` (L341)**: casing — should be `rotateYNew` to match `rotateXNew`/`rotateZNew`.
- **`transformByQuat` (L409)**: `uuv.scale(2 * qa[3])` is wrong. Formula is `v' = v + 2w(t×v) + 2(t×(t×v))` — `uuv` must scale by `2`, not `2 * w`.
- **`getAngle` static (L1009–1010)**: projects both vectors to `.xy` (2D) before computing angle — ignores Z entirely. Should operate on the 3D vectors directly.
- **`fromRotationMatrix` `order` param (L1035)**: typed as `String` (boxed object) — should be `string`.

### Vec4.ts
- **`z` setter error message (L792)**: says `"Y should be a number"` — should be `"Z"`.
- **`rotateX` (L409–410)**, **`rotateY` (L432–433)**, **`rotateZ` (L455–456)**: same clobber bugs as Vec3's rotate methods.
- **`transformByMat4` (L472–475)**: doesn't use `o.w` in the matrix multiplication; divides x/y/z by `this.w` inconsistently. A proper 4D transform should multiply all four components by the 4×4 matrix.
- **`xw` setter (L1095)**: sets `this.z` instead of `this.w`.

### Mat2.ts
- **`determinant` getter (L262)**: `this.a11 * this.a21 - this.a21 * this.a12` is wrong (uses `a21` twice, never reads `a22`). Correct: `this.a11 * this.a22 - this.a12 * this.a21`.

### Mat3.ts
- **`fromAngle` (L563)**: last matrix element should be `1`, not `0` — the current output has a zero in the `a33` position, making it singular.

### Mat4.ts
- **`rotate` (L418)**: after `l = 1 / l`, `l` is the reciprocal of length. Then `aa[0] / l` = `aa[0] * length` (scales up, not normalises). Should be `aa[0] * l`.
- **`transform` (L331–334)**: modifies `a14, a24, a34` (last column), but the rest of the codebase stores translation in `a41, a42, a43` (last row). Inconsistent with `translate`, `fromTranslatingVec3`, `fromRotationTranslationScale`, and the `translation` getter.
