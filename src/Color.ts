/**
 * An RGBA colour in 0–1 space, with conversions to and from hex, HSL, HSV,
 * OKLab and OKLCH. Imported separately from the rest of wtc-math:
 *
 * ```ts
 * import { Color } from 'wtc-math/color'
 * ```
 *
 * @module wtc-math/color
 */

/**
 * Anything {@link Color.interpolate} can turn into a {@link Color}: an object
 * with 0–1 `r`, `g`, `b` and optional `a`, an `[r, g, b, a?]` array in 0–1,
 * or a string {@link Color.fromCSS} can read: hex (`"#rgb"`, `"#rgba"`,
 * `"#rrggbb"` or `"#rrggbbaa"`, `#` optional), `rgb()`/`rgba()` or
 * `hsl()`/`hsla()`. Alpha defaults to 1.
 */
export type ColorLike =
  | {
      /** Red, 0–1. */
      r: number;
      /** Green, 0–1. */
      g: number;
      /** Blue, 0–1. */
      b: number;
      /** Alpha, 0–1. Defaults to 1. */
      a?: number;
    }
  | [number, number, number, number?]
  | string;

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

// Below this OKLCH chroma a colour is treated as grey. Greys come out of the
// conversion at ~1e-8, and an 8-bit colour one step off grey is ~1e-3.
const ACHROMATIC_CHROMA = 1e-4;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function colorToOklab(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

function oklabToColor(L: number, a: number, b: number, alpha: number): Color {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return new Color(
    clamp01(linearToSrgb( 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
    clamp01(linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
    clamp01(linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)),
    alpha,
  );
}

/**
 * An RGBA colour with each channel in 0–1. Channels are gamma-encoded sRGB,
 * as used by CSS.
 *
 * Methods without the `New` suffix modify the colour and return it; the
 * `New` variants return a new colour and leave this one unchanged. The
 * constructor does not clamp, so channels can hold values outside 0–1.
 *
 * For perceptually even blends use {@link Color.lerpOklab} or
 * {@link Color.lerpOklch} instead of {@link Color.lerp}.
 */
class Color {
  /** Red, 0–1. */
  r: number;
  /** Green, 0–1. */
  g: number;
  /** Blue, 0–1. */
  b: number;
  /** Alpha (opacity), 0–1. */
  a: number;

  /**
   * Creates a colour from 0–1 channels. Values are stored as given.
   *
   * @param r Red, 0–1. Defaults to 0.
   * @param g Green, 0–1. Defaults to 0.
   * @param b Blue, 0–1. Defaults to 0.
   * @param a Alpha, 0–1. Defaults to 1.
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Copies this colour.
   *
   * @returns A new colour with the same channels.
   */
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Adds another colour channel by channel, including alpha, capping each
   * channel at 1. Modifies this colour.
   *
   * @param c The colour to add.
   * @returns This colour.
   */
  add(c: Color): Color {
    this.r = Math.min(1, this.r + c.r);
    this.g = Math.min(1, this.g + c.g);
    this.b = Math.min(1, this.b + c.b);
    this.a = Math.min(1, this.a + c.a);
    return this;
  }

  /**
   * Adds another colour channel by channel, as {@link Color.add}, without
   * modifying this one.
   *
   * @param c The colour to add.
   * @returns A new colour.
   */
  addNew(c: Color): Color {
    return this.clone().add(c);
  }

  /**
   * Multiplies by another colour channel by channel, including alpha.
   * Modifies this colour.
   *
   * @param c The colour to multiply by.
   * @returns This colour.
   */
  multiply(c: Color): Color {
    this.r *= c.r;
    this.g *= c.g;
    this.b *= c.b;
    this.a *= c.a;
    return this;
  }

  /**
   * Multiplies by another colour channel by channel, as
   * {@link Color.multiply}, without modifying this one.
   *
   * @param c The colour to multiply by.
   * @returns A new colour.
   */
  multiplyNew(c: Color): Color {
    return this.clone().multiply(c);
  }

  /**
   * Scales red, green and blue by a number, capping each at 1. Alpha is left
   * unchanged. Modifies this colour.
   *
   * @param s The scale factor.
   * @returns This colour.
   */
  multiplyScalar(s: number): Color {
    this.r = Math.min(1, this.r * s);
    this.g = Math.min(1, this.g * s);
    this.b = Math.min(1, this.b * s);
    return this;
  }

  /**
   * Scales red, green and blue by a number, as {@link Color.multiplyScalar},
   * without modifying this colour.
   *
   * @param s The scale factor.
   * @returns A new colour.
   */
  multiplyScalarNew(s: number): Color {
    return this.clone().multiplyScalar(s);
  }

  /**
   * Linearly interpolates every channel, including alpha, towards another
   * colour in sRGB space. `t` is not clamped. Modifies this colour.
   *
   * @param c The target colour.
   * @param t The interpolation factor: 0 keeps this colour, 1 gives `c`.
   * @returns This colour.
   */
  lerp(c: Color, t: number): Color {
    this.r += (c.r - this.r) * t;
    this.g += (c.g - this.g) * t;
    this.b += (c.b - this.b) * t;
    this.a += (c.a - this.a) * t;
    return this;
  }

  /**
   * Linearly interpolates towards another colour, as {@link Color.lerp},
   * without modifying this one.
   *
   * @param c The target colour.
   * @param t The interpolation factor: 0 gives this colour, 1 gives `c`.
   * @returns A new colour.
   */
  lerpNew(c: Color, t: number): Color {
    return this.clone().lerp(c, t);
  }

  /**
   * Formats the colour as a CSS colour string, with red, green and blue
   * clamped to 0–1 and rounded to 0–255, and alpha clamped to 0–1.
   *
   * @returns `"rgb(r, g, b)"` when alpha is exactly 1, otherwise
   * `"rgba(r, g, b, a)"`.
   */
  toCSS(): string {
    const r = Math.round(clamp01(this.r) * 255);
    const g = Math.round(clamp01(this.g) * 255);
    const b = Math.round(clamp01(this.b) * 255);
    const a = clamp01(this.a);
    if (a === 1) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Formats the colour as a 6-digit lowercase hex string, with each channel
   * clamped to 0–1 first. Alpha is dropped.
   *
   * @returns A string such as `"#ff8000"`.
   */
  toHex(): string {
    const ch = (v: number) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0");
    return `#${ch(this.r)}${ch(this.g)}${ch(this.b)}`;
  }

  /**
   * Converts to HSL. Alpha is ignored.
   *
   * @returns `[h, s, l]` with hue in degrees (0–360) and saturation and
   * lightness in 0–1. Greys have a hue of 0.
   */
  toHSL(): [number, number, number] {
    const { r, g, b } = this;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h: number;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [h * 360, s, l];
  }

  /**
   * Converts to HSV (also called HSB). Alpha is ignored.
   *
   * @returns `[h, s, v]` with hue in degrees (0–360) and saturation and
   * value in 0–1. Greys have a hue of 0.
   */
  toHSV(): [number, number, number] {
    const { r, g, b } = this;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) return [0, s, max];
    let h: number;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [h * 360, s, max];
  }

  /**
   * Converts to OKLab, a perceptual colour space. Alpha is ignored.
   *
   * @returns `[L, a, b]` with lightness in 0–1 and `a` and `b` roughly
   * between −0.5 and 0.5.
   */
  toOklab(): [number, number, number] {
    return colorToOklab(this.r, this.g, this.b);
  }

  /**
   * Converts to OKLCH, the polar form of OKLab. Alpha is ignored.
   *
   * @returns `[L, C, H]` with lightness in 0–1, chroma roughly 0–0.4 and hue
   * in degrees (0–360). The hue of a grey is not meaningful.
   */
  toOklch(): [number, number, number] {
    const [L, a, b] = colorToOklab(this.r, this.g, this.b);
    const C = Math.sqrt(a * a + b * b);
    const H = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    return [L, C, H];
  }

  /**
   * The channels as an array.
   *
   * @returns A new `[r, g, b, a]` array.
   */
  get array(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }

  /**
   * Formats the colour as a CSS string, the same as {@link Color.toCSS}.
   *
   * @returns `"rgb(…)"` or `"rgba(…)"`.
   */
  toString(): string {
    return this.toCSS();
  }

  /**
   * Creates a colour from a hex string, with or without a leading `#`: 3 or
   * 6 digits (`"#f80"`, `"ff8800"`), or 4 or 8 digits with alpha last
   * (`"#f808"`, `"#ff880080"`). Alpha is 1 when it isn't given. Throws an
   * `Error` for anything else.
   *
   * @param hex The hex string.
   * @returns A new colour.
   */
  static fromHex(hex: string): Color {
    const clean = hex.trim().replace(/^#/, "");
    if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(clean)) {
      throw new Error(`"${hex}" is not a 3, 4, 6 or 8-digit hex colour`);
    }
    const full =
      clean.length <= 4
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    const channel = (i: number) => parseInt(full.slice(i * 2, i * 2 + 2), 16) / 255;
    return new Color(channel(0), channel(1), channel(2), full.length === 8 ? channel(3) : 1);
  }

  /**
   * Creates a colour from a CSS colour string: hex (see {@link Color.fromHex}),
   * `rgb()`/`rgba()` or `hsl()`/`hsla()`. Both the comma syntax
   * (`"rgba(255, 136, 0, 0.5)"`) and the space syntax
   * (`"rgb(255 136 0 / 50%)"`) work, and channels can be percentages. Values
   * are clamped to 0–1, as CSS does. Named colours, `none` and other colour
   * functions aren't supported and throw an `Error`.
   *
   * @param css The CSS colour string.
   * @returns A new colour.
   */
  static fromCSS(css: string): Color {
    const match = /^\s*(rgba?|hsla?)\(\s*([^)]*)\)\s*$/i.exec(css);
    if (!match) return Color.fromHex(css);

    const fn = match[1].toLowerCase();
    const parts = match[2].split(/\s*[,/]\s*|\s+/).filter(Boolean);
    const fail = () => new Error(`"${css}" is not a colour Color.fromCSS can read`);
    if (parts.length < 3 || parts.length > 4) throw fail();

    // A number, or a percentage of `percentOf`
    const num = (part: string, scale: number, percentOf = 1): number => {
      const isPercent = part.endsWith("%");
      const n = Number(isPercent ? part.slice(0, -1) : part);
      if (part === "" || Number.isNaN(n)) throw fail();
      return isPercent ? (n / 100) * percentOf : n / scale;
    };
    const alpha = parts.length === 4 ? clamp01(num(parts[3], 1)) : 1;

    if (fn.startsWith("rgb")) {
      const [r, g, b] = parts.slice(0, 3).map((p) => clamp01(num(p, 255)));
      return new Color(r, g, b, alpha);
    }

    const hue = parts[0].toLowerCase().endsWith("deg") ? parts[0].slice(0, -3) : parts[0];
    const h = num(hue, 1);
    const [sat, light] = parts.slice(1, 3).map((p) => clamp01(num(p, 100)));
    return Color.fromHSL(((h % 360) + 360) % 360, sat, light, alpha);
  }

  /**
   * Creates a colour from HSL values.
   *
   * @param h Hue in degrees (0–360).
   * @param s Saturation, 0–1.
   * @param l Lightness, 0–1.
   * @param a Alpha, 0–1. Defaults to 1.
   * @returns A new colour.
   */
  static fromHSL(h: number, s: number, l: number, a = 1): Color {
    const hNorm = h / 360;
    if (s === 0) return new Color(l, l, l, a);
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return new Color(
      hue2rgb(p, q, hNorm + 1 / 3),
      hue2rgb(p, q, hNorm),
      hue2rgb(p, q, hNorm - 1 / 3),
      a
    );
  }

  /**
   * Creates a colour from 0–255 channels, dividing each by 255.
   *
   * @param r Red, 0–255.
   * @param g Green, 0–255.
   * @param b Blue, 0–255.
   * @param a Alpha, 0–255. Defaults to 255.
   * @returns A new colour.
   */
  static fromRGB255(r: number, g: number, b: number, a = 255): Color {
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }

  /**
   * Creates a colour from HSV (HSB) values.
   *
   * @param h Hue in degrees (0–360). Other values wrap around.
   * @param s Saturation, 0–1.
   * @param v Value (brightness), 0–1.
   * @param a Alpha, 0–1. Defaults to 1.
   * @returns A new colour.
   */
  static fromHSV(h: number, s: number, v: number, a = 1): Color {
    const sector = ((((h % 360) + 360) % 360) / 360) * 6;
    const i = Math.floor(sector);
    const f = sector - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const cases: [number, number, number][] = [
      [v, t, p], [q, v, p], [p, v, t],
      [p, q, v], [t, p, v], [v, p, q],
    ];
    const [r, g, b] = cases[i % 6];
    return new Color(r, g, b, a);
  }

  /**
   * Creates a colour from OKLab values. Results outside the sRGB gamut are
   * clamped to 0–1 per channel.
   *
   * @param L Lightness, 0–1.
   * @param a Green–red axis, roughly −0.5 to 0.5.
   * @param b Blue–yellow axis, roughly −0.5 to 0.5.
   * @param alpha Alpha, 0–1. Defaults to 1.
   * @returns A new colour.
   */
  static fromOklab(L: number, a: number, b: number, alpha = 1): Color {
    return oklabToColor(L, a, b, alpha);
  }

  /**
   * Creates a colour from OKLCH values. Results outside the sRGB gamut are
   * clamped to 0–1 per channel.
   *
   * @param L Lightness, 0–1.
   * @param C Chroma, roughly 0–0.4.
   * @param H Hue in degrees (0–360).
   * @param alpha Alpha, 0–1. Defaults to 1.
   * @returns A new colour.
   */
  static fromOklch(L: number, C: number, H: number, alpha = 1): Color {
    const hRad = (H * Math.PI) / 180;
    return oklabToColor(L, C * Math.cos(hRad), C * Math.sin(hRad), alpha);
  }

  /**
   * Linearly interpolates every channel, including alpha, between two colours
   * in sRGB space. `t` is not clamped.
   *
   * @param c1 The colour at `t = 0`.
   * @param c2 The colour at `t = 1`.
   * @param t The interpolation factor.
   * @returns A new colour.
   */
  static lerp(c1: Color, c2: Color, t: number): Color {
    return c1.clone().lerp(c2, t);
  }

  /**
   * Interpolates between two colours in OKLab space, which gives more even
   * perceived steps than {@link Color.lerp}. Alpha is interpolated linearly.
   *
   * @param c1 The colour at `t = 0`.
   * @param c2 The colour at `t = 1`.
   * @param t The interpolation factor.
   * @returns A new colour, clamped to 0–1 per channel.
   */
  static lerpOklab(c1: Color, c2: Color, t: number): Color {
    const [L1, a1, b1] = colorToOklab(c1.r, c1.g, c1.b);
    const [L2, a2, b2] = colorToOklab(c2.r, c2.g, c2.b);
    return oklabToColor(
      L1 + (L2 - L1) * t,
      a1 + (a2 - a1) * t,
      b1 + (b2 - b1) * t,
      c1.a + (c2.a - c1.a) * t,
    );
  }

  /**
   * Interpolates between two colours in OKLCH space, taking the shorter way
   * round the hue circle. If one end is grey, the other end's hue is used
   * throughout so the blend does not pass through unrelated hues. Alpha is
   * interpolated linearly.
   *
   * @param c1 The colour at `t = 0`.
   * @param c2 The colour at `t = 1`.
   * @param t The interpolation factor.
   * @returns A new colour, clamped to 0–1 per channel.
   */
  static lerpOklch(c1: Color, c2: Color, t: number): Color {
    const [L1, C1, h1] = c1.toOklch();
    const [L2, C2, h2] = c2.toOklch();
    // An achromatic colour's hue is meaningless (just float noise), so take
    // the other endpoint's hue rather than sweeping through unrelated hues
    const H1 = C1 < ACHROMATIC_CHROMA ? h2 : h1;
    const H2 = C2 < ACHROMATIC_CHROMA ? h1 : h2;
    let dH = H2 - H1;
    if (dH > 180) dH -= 360;
    if (dH < -180) dH += 360;
    return Color.fromOklch(
      L1 + (L2 - L1) * t,
      C1 + (C2 - C1) * t,
      H1 + dH * t,
      c1.a + (c2.a - c1.a) * t,
    );
  }

  /**
   * Creates a colour from any {@link ColorLike}: a CSS colour string (see
   * {@link Color.fromCSS}), an `[r, g, b, a?]` array or an `{ r, g, b, a? }`
   * object, both in 0–1. Missing alpha defaults to 1. Throws an `Error` for
   * a string it can't read.
   *
   * @param v The value to convert.
   * @returns A new colour.
   */
  static interpolate(v: ColorLike): Color {
    if (typeof v === "string") return Color.fromCSS(v);
    if (Array.isArray(v)) return new Color(v[0], v[1], v[2], v[3] ?? 1);
    return new Color(v.r, v.g, v.b, v.a ?? 1);
  }
}

export { Color };
