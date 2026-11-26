// Regression tests for the colour items in KNOWN-ISSUES.md
import { describe, expect, it } from "vitest";
import { Color } from "../src/Color.js";
import { expectArrayClose } from "./helpers.js";

const rgba = (c: Color) => [c.r, c.g, c.b, c.a];

describe("Color.fromHSV", () => {
  it("wraps a negative hue instead of throwing", () => {
    expectArrayClose(rgba(Color.fromHSV(-120, 1, 1)), rgba(Color.fromHSV(240, 1, 1)));
    expectArrayClose(rgba(Color.fromHSV(-30, 0.5, 0.8)), rgba(Color.fromHSV(330, 0.5, 0.8)));
  });

  it("wraps hues of 360 and above", () => {
    expectArrayClose(rgba(Color.fromHSV(360, 1, 1)), [1, 0, 0, 1]);
    expectArrayClose(rgba(Color.fromHSV(480, 1, 1)), rgba(Color.fromHSV(120, 1, 1)));
  });
});

describe("Color.fromHex", () => {
  it("reads alpha from 4- and 8-digit hex", () => {
    expectArrayClose(rgba(Color.fromHex("#ff000080")), [1, 0, 0, 128 / 255]);
    expectArrayClose(rgba(Color.fromHex("f008")), [1, 0, 0, 0x88 / 255]);
  });

  it("still reads 3- and 6-digit hex with alpha 1", () => {
    expectArrayClose(rgba(Color.fromHex("#f80")), [1, 0x88 / 255, 0, 1]);
    expectArrayClose(rgba(Color.fromHex("3a7bd5")), [0x3a / 255, 0x7b / 255, 0xd5 / 255, 1]);
  });

  it("throws for strings that aren't hex", () => {
    for (const s of ["", "#", "#12", "#12345", "#ggg", "red", "rgb(1, 2, 3)", "#1234567"]) {
      expect(() => Color.fromHex(s), s).toThrow();
    }
  });
});

describe("Color.fromCSS", () => {
  it("reads rgb() and rgba(), with commas or spaces", () => {
    expectArrayClose(rgba(Color.fromCSS("rgb(255, 136, 0)")), [1, 136 / 255, 0, 1]);
    expectArrayClose(rgba(Color.fromCSS("rgba(0, 0, 255, 0.5)")), [0, 0, 1, 0.5]);
    expectArrayClose(rgba(Color.fromCSS("rgb(255 0 0 / 25%)")), [1, 0, 0, 0.25]);
    expectArrayClose(rgba(Color.fromCSS("RGB(100%, 50%, 0%)")), [1, 0.5, 0, 1]);
  });

  it("reads hsl() and hsla()", () => {
    expectArrayClose(rgba(Color.fromCSS("hsl(120, 100%, 50%)")), [0, 1, 0, 1]);
    expectArrayClose(rgba(Color.fromCSS("hsla(240deg 100% 50% / 0.5)")), [0, 0, 1, 0.5]);
  });

  it("reads hex", () => {
    expectArrayClose(rgba(Color.fromCSS("#ff000080")), [1, 0, 0, 128 / 255]);
  });

  it("round-trips toCSS", () => {
    for (const c of [new Color(1, 0.5, 0), new Color(0.2, 0.4, 0.6, 0.3)]) {
      expectArrayClose(rgba(Color.fromCSS(c.toCSS())), rgba(c), 2);
    }
  });

  it("throws for strings it can't read", () => {
    for (const s of ["red", "rgb(1, 2)", "rgb(a, b, c)", "hsl(1, 2%, 3%, 4, 5)", "cmyk(0, 0, 0, 0)"]) {
      expect(() => Color.fromCSS(s), s).toThrow();
    }
  });

  it("is used by interpolate for strings", () => {
    expectArrayClose(rgba(Color.interpolate("rgba(255, 0, 0, 0.5)")), [1, 0, 0, 0.5]);
    expectArrayClose(rgba(Color.interpolate("#00ff00")), [0, 1, 0, 1]);
  });
});

describe("formatting", () => {
  it("toHex clamps each channel to 0–1", () => {
    expect(new Color(1.5, -0.2, 0.5).toHex()).toBe("#ff0080");
  });

  it("toCSS clamps each channel and alpha to 0–1", () => {
    expect(new Color(2, -1, 0.5).toCSS()).toBe("rgb(255, 0, 128)");
    expect(new Color(0, 0, 0, -0.5).toCSS()).toBe("rgba(0, 0, 0, 0)");
    expect(new Color(0, 0, 0, 1.5).toCSS()).toBe("rgb(0, 0, 0)");
  });
});
