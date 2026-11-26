---
"wtc-math": minor
---

Fix vector bugs listed in KNOWN-ISSUES.md:

- Swizzle setters now write components in the order the name gives. `yzx`, `zxy` and `zy` (Vec3, Vec4) wrote the wrong components, and `xx`, `yy`, `zz` and `ww` took their value from the second component instead of the first.
- The `lengthSquared` setter now sets the squared length (Vec2, Vec3, Vec4). Setting `length` or `lengthSquared` on a zero vector leaves it at zero.
- **Behaviour change:** `Vec3.cross` and `Vec4.cross` now change the vector in place, like every other method without the `New` suffix. Use `crossNew` to keep the old behaviour.
- **Behaviour change:** `Vec4.getAngle` now returns the angle between two 4D vectors. The rotation angle between two quaternions moves to the new `Quat.getAngle`, which `Quat` used to inherit from `Vec4`. Neither returns `NaN` from rounding any more.
- `inverse` turns a zero component into 0, as `divide` does, instead of `Infinity`.
- The `Vec2.slope` setter no longer flips a vector that points left.
- The x, y, z and w setters store `NaN` as 0.
