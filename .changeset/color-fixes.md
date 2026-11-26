---
"wtc-math": minor
---

Fix colour bugs listed in KNOWN-ISSUES.md:

- `Color.fromHSV` wraps any hue, so a negative hue no longer throws.
- `Color.fromHex` reads alpha from 4- and 8-digit hex. **Behaviour change:** it throws an `Error` for a string that isn't hex, which used to give black.
- New `Color.fromCSS` reads hex, `rgb()`/`rgba()` and `hsl()`/`hsla()`, in the comma or space syntax. `Color.interpolate`, and so any `ColorLike` string, uses it, so CSS strings now work wherever a colour is accepted.
- `toHex` and `toCSS` clamp each channel (and `toCSS` alpha) to 0–1, so they always give a valid string.
