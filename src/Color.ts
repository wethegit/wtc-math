export type ColorLike =
  | { r: number; g: number; b: number; a?: number }
  | [number, number, number, number?]
  | string;

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

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

class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  add(c: Color): Color {
    this.r = Math.min(1, this.r + c.r);
    this.g = Math.min(1, this.g + c.g);
    this.b = Math.min(1, this.b + c.b);
    this.a = Math.min(1, this.a + c.a);
    return this;
  }

  addNew(c: Color): Color {
    return this.clone().add(c);
  }

  multiply(c: Color): Color {
    this.r *= c.r;
    this.g *= c.g;
    this.b *= c.b;
    this.a *= c.a;
    return this;
  }

  multiplyNew(c: Color): Color {
    return this.clone().multiply(c);
  }

  multiplyScalar(s: number): Color {
    this.r = Math.min(1, this.r * s);
    this.g = Math.min(1, this.g * s);
    this.b = Math.min(1, this.b * s);
    return this;
  }

  multiplyScalarNew(s: number): Color {
    return this.clone().multiplyScalar(s);
  }

  lerp(c: Color, t: number): Color {
    this.r += (c.r - this.r) * t;
    this.g += (c.g - this.g) * t;
    this.b += (c.b - this.b) * t;
    this.a += (c.a - this.a) * t;
    return this;
  }

  lerpNew(c: Color, t: number): Color {
    return this.clone().lerp(c, t);
  }

  toCSS(): string {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    if (this.a === 1) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${this.a})`;
  }

  toHex(): string {
    const ch = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
    return `#${ch(this.r)}${ch(this.g)}${ch(this.b)}`;
  }

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

  // h: 0–360, s: 0–1, v: 0–1
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

  // L: 0–1, a/b: approx –0.5–0.5
  toOklab(): [number, number, number] {
    return colorToOklab(this.r, this.g, this.b);
  }

  // L: 0–1, C: 0–0.4 approx, H: 0–360°
  toOklch(): [number, number, number] {
    const [L, a, b] = colorToOklab(this.r, this.g, this.b);
    const C = Math.sqrt(a * a + b * b);
    const H = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    return [L, C, H];
  }

  get array(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }

  toString(): string {
    return this.toCSS();
  }

  static fromHex(hex: string): Color {
    const clean = hex.replace("#", "");
    const full =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    const n = parseInt(full, 16);
    return new Color(
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255
    );
  }

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

  static fromRGB255(r: number, g: number, b: number, a = 255): Color {
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }

  // h: 0–360, s: 0–1, v: 0–1
  static fromHSV(h: number, s: number, v: number, a = 1): Color {
    const i = Math.floor((h / 360) * 6);
    const f = (h / 360) * 6 - i;
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

  static fromOklab(L: number, a: number, b: number, alpha = 1): Color {
    return oklabToColor(L, a, b, alpha);
  }

  // H in degrees (0–360)
  static fromOklch(L: number, C: number, H: number, alpha = 1): Color {
    const hRad = (H * Math.PI) / 180;
    return oklabToColor(L, C * Math.cos(hRad), C * Math.sin(hRad), alpha);
  }

  static lerp(c1: Color, c2: Color, t: number): Color {
    return c1.clone().lerp(c2, t);
  }

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

  static lerpOklch(c1: Color, c2: Color, t: number): Color {
    const [L1, C1, H1] = c1.toOklch();
    const [L2, C2, H2] = c2.toOklch();
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

  static interpolate(v: ColorLike): Color {
    if (typeof v === "string") return Color.fromHex(v);
    if (Array.isArray(v)) return new Color(v[0], v[1], v[2], v[3] ?? 1);
    return new Color(v.r, v.g, v.b, v.a ?? 1);
  }
}

export { Color };
