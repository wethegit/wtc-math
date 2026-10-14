import { describe, expect, it } from "vitest";
import { Color } from "../src/Color.js";
import { expectArrayClose, random } from "./helpers.js";

const randomColor = () => new Color(random(0, 1), random(0, 1), random(0, 1));
const rgb = (c: Color) => [c.r, c.g, c.b];

describe("Color", () => {
  it("round-trips through hex", () => {
    expect(Color.fromHex("#3a7bd5").toHex()).toBe("#3a7bd5");
    expect(Color.fromHex("#fff").toHex()).toBe("#ffffff");
  });

  it("formats CSS with and without alpha", () => {
    expect(new Color(1, 0, 0).toCSS()).toBe("rgb(255, 0, 0)");
    expect(new Color(0, 0, 1, 0.5).toCSS()).toBe("rgba(0, 0, 255, 0.5)");
  });

  it("round-trips through HSL and HSV", () => {
    for (let i = 0; i < 20; i++) {
      const c = randomColor();
      expectArrayClose(rgb(Color.fromHSL(...c.toHSL())), rgb(c), 5);
      expectArrayClose(rgb(Color.fromHSV(...c.toHSV())), rgb(c), 5);
    }
  });

  it("matches the reference OKLab value for sRGB red", () => {
    // Björn Ottosson's reference: #ff0000 is L 0.6279, a 0.2249, b 0.1258
    expectArrayClose(new Color(1, 0, 0).toOklab(), [0.6279554, 0.2248631, 0.1258463], 4);
  });

  it("maps white to L = 1 with no chroma", () => {
    expectArrayClose(new Color(1, 1, 1).toOklab(), [1, 0, 0], 4);
  });

  it("round-trips through OKLab and OKLCH", () => {
    for (let i = 0; i < 20; i++) {
      const c = randomColor();
      expectArrayClose(rgb(Color.fromOklab(...c.toOklab())), rgb(c), 5);
      expectArrayClose(rgb(Color.fromOklch(...c.toOklch())), rgb(c), 5);
    }
  });

  it("lerps with the endpoints at t = 0 and t = 1", () => {
    const a = new Color(1, 0, 0);
    const b = new Color(0, 0, 1);
    for (const lerp of [Color.lerp, Color.lerpOklab, Color.lerpOklch]) {
      expectArrayClose(rgb(lerp(a, b, 0)), rgb(a), 5);
      expectArrayClose(rgb(lerp(a, b, 1)), rgb(b), 5);
    }
  });
});
