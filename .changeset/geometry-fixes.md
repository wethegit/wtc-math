---
"wtc-math": minor
---

Fix plane, ray and scalar function bugs listed in KNOWN-ISSUES.md:

- `Ray.intersectBox` returns the exit point when the ray starts inside the box, as `intersectSphere` does, instead of null. A ray parallel to a face whose origin lies exactly on that face's plane no longer computes 0/0.
- **Behaviour change:** the `Plane` constructor normalises the normal, scaling the constant by the same factor so the plane stays in place. `distanceTo` and `projectPoint` are now right for a plane built from a non-unit normal. `normalize` leaves a zero normal unchanged instead of storing `Infinity`.
- `pingpong` stays in `[0, length]` for a negative `t`.
- `map` returns `outMin` when `inMin === inMax`, instead of dividing by zero.
- `smoothstep` and `smootherstep` act as a step when `edge0 === edge1`, instead of returning NaN.
