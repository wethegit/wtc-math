# wtc-math

A TypeScript math library providing Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, and Quat classes.

## Build

```bash
npm run build        # Vite build (replaced microbundle)
npx tsc --noEmit     # Type-check only
```

## In-progress: TypeScript type improvements

Replacing `any` parameters on methods that accept vectors/matrices/arrays with proper named types.

### Completed

**`src/types.ts`** — central types file (no class imports, uses structural typing to avoid circular deps):
- `Vec2Like = { x: number; y: number } | [number, number]`

**`src/Vec2.ts`** — `Vec2Like` applied to:
- Swizzle getters `yx`, `xx`, `yy` → return `Vec2`
- Swizzle setters `yx`, `xx`, `yy` → param `Vec2Like`
- `static interpolate(v)` → `Vec2Like | number | string`, returns `Vec2`

**`src/Vec3.ts`** — `Vec2Like` applied to all 8 two-component swizzles (`xy`, `yz`, `zx`, `yx`, `zy`, `xx`, `yy`, `zz`): getters return `Vec2`, setters accept `Vec2Like`.

**`src/Vec4.ts`** — `Vec2Like` applied to all 16 two-component swizzles (`xx`–`ww`): getters return `Vec2`, setters accept `Vec2Like`. V4Q interface declarations updated to `Vec2Like`.

**`src/Mat2.ts`** — `Vec2Like` applied to `scaleByVec2`, `scaleByVec2New`, `fromScalingVec2`. Bodies simplified using `Array.isArray(v) ? v : [v.x, v.y]`.

**`src/Mat3.ts`** — same as Mat2 for `scaleByVec2`, `scaleByVec2New`, `fromScalingVec2`.

### Remaining

The following still use `any` and need new types added to `src/types.ts`:

**`Vec3Like = { x: number; y: number; z: number } | [number, number, number]`**
- `Vec3.ts`: 3-component swizzles `xyz`, `yzx`, `zxy` (getters + setters), `static interpolate`
- `Vec4.ts`: 3-component swizzles `xyz`, `yzx`, `zxy` (getters + setters)
- `Mat4.ts`: `scaleByVec3`, `scaleByVec3New`, `fromScalingVec3`, `fromTranslatingVec3`, `transform`, `transformNew`, `transformTo`, `transformToNew`, `translate`, `translateNew`, `fromRotationTranslationScale` (v, s params), `fromRotationTranslationScaleOrigin` (v, s, o params), `lookAt` (all params), `targetTo` (all params), `rotate` (axis param)

**`Vec4Like = { x: number; y: number; z: number; w: number } | [number, number, number, number]`**
- `Vec4.ts`: 4-component swizzles `xyzw`, `yzwx`, `zwxy`, `wxyz` (getters + setters), `static interpolate`
- V4Q interface: `xyzw`, `yzwx`, `zwxy`, `wxyz` properties

**`QuatLike = { x: number; y: number; z: number; w: number } | [number, number, number, number]`**
  (likely same structure as Vec4Like — consider a shared alias)
- `Mat4.ts`: `fromQuat`, `fromRotationTranslationScale` (q param), `fromRotationTranslationScaleOrigin` (q param)
- `Mat3.ts`: `fromQuat`
- `Vec3.ts`: `transformByQuat`, `transformByQuatNew`
- `Vec4.ts`: `transformByQuat`, `transformByQuatNew`
- `Quat.ts`: `fromEuler` (euler param — actually Vec3Like)

**`Mat2Like`, `Mat3Like`, `Mat4Like`** (structural: `{ array: number[] } | number[]`)
  Note: Mat3 imports Vec2, so Vec2 cannot import Mat3 (circular). Use structural typing.
- `Vec2.ts`: `transformByMat2`, `transformByMat2New`, `transformByMat3`, `transformByMat3New`
- `Vec3.ts`: `transformByMat4`, `transformByMat4New`, `transformByMat3`, `transformByMat3New`
- `Vec4.ts`: `transformByMat4`, `transformByMat4New`
- `Vec3.ts`: `fromRotationMatrix`
