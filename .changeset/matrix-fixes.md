---
"wtc-math": minor
---

Fix matrix and quaternion bugs listed in KNOWN-ISSUES.md:

- **Behaviour change:** `Mat2.fromAngle` and `Mat3.fromAngle` now turn counter-clockwise, the same way as `rotate` and `Vec2.rotate`. They used to turn clockwise. Negate the angle to keep the old result.
- **Behaviour change:** `Mat3.fromQuat` now rotates the same way as the quaternion, and equals the upper 3×3 of `Mat4.fromQuat`. It used to rotate by the inverse.
- **Behaviour change:** `Mat2.columnArray` and `Mat3.columnArray` now return column-major order, the same as `array`, and are deprecated. The new `rowArray` gives the row-major order they used to return.
- **Behaviour change:** `Quat.inverse` and `Quat.inverseNew` are now the quaternion inverse, the same as `invert` and `invertNew`, instead of the reciprocal of each component.
- `Mat4.transformToNew` sets the translation instead of adding to it.
- `Mat4.rotation` is right for a non-uniform scale.
- `Quat.lerp` and `Quat.interpolate` return a `Quat` instead of a `Vec4`.
- `Mat3.translate` accepts a `Vec2Like`, and there's a new `Mat3.translateNew`. `Mat4.fromRotation` types its axis as `Vec3Like`.
