export type ColorLike =
  | { r: number; g: number; b: number; a?: number }
  | [number, number, number, number?]
  | string;

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

  static lerp(c1: Color, c2: Color, t: number): Color {
    return c1.clone().lerp(c2, t);
  }

  static interpolate(v: ColorLike): Color {
    if (typeof v === "string") return Color.fromHex(v);
    if (Array.isArray(v)) return new Color(v[0], v[1], v[2], v[3] ?? 1);
    return new Color(v.r, v.g, v.b, v.a ?? 1);
  }
}

export { Color };
