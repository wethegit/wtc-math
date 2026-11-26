// Regression tests for the vector items in KNOWN-ISSUES.md
import { describe, expect, it } from "vitest";
import { Quat, Vec2, Vec3, Vec4 } from "../src/index.js";
import { expectArrayClose } from "./helpers.js";

describe("swizzle setters", () => {
  it("Vec3.yzx and zxy write the inverse of their getters", () => {
    const a = new Vec3();
    a.yzx = [1, 2, 3];
    expectArrayClose(a.array, [3, 1, 2]);
    expectArrayClose(a.yzx.array, [1, 2, 3]);

    const b = new Vec3();
    b.zxy = [1, 2, 3];
    expectArrayClose(b.array, [2, 3, 1]);
    expectArrayClose(b.zxy.array, [1, 2, 3]);

    const c = new Vec3();
    c.yzx = new Vec3(1, 2, 3);
    expectArrayClose(c.array, [3, 1, 2]);
  });

  it("Vec4.yzx and zxy write the inverse of their getters", () => {
    const a = new Vec4(0, 0, 0, 9);
    a.yzx = [1, 2, 3];
    expectArrayClose(a.array, [3, 1, 2, 9]);

    const b = new Vec4(0, 0, 0, 9);
    b.zxy = new Vec3(1, 2, 3);
    expectArrayClose(b.array, [2, 3, 1, 9]);
  });

  it("zy writes z first, then y", () => {
    const a = new Vec3(9, 0, 0);
    a.zy = [1, 2];
    expectArrayClose(a.array, [9, 2, 1]);

    const b = new Vec4(9, 0, 0, 9);
    b.zy = [1, 2];
    expectArrayClose(b.array, [9, 2, 1, 9]);
  });

  it("xx, yy and zz take their value from the first component", () => {
    const a = new Vec2();
    a.xx = [1, 2];
    a.yy = [3, 4];
    expectArrayClose(a.array, [1, 3]);

    const b = new Vec3();
    b.xx = [1, 2];
    b.yy = [3, 4];
    b.zz = [5, 6];
    expectArrayClose(b.array, [1, 3, 5]);

    const c = new Vec4();
    c.xx = [1, 2];
    c.yy = [3, 4];
    c.zz = [5, 6];
    c.ww = [7, 8];
    expectArrayClose(c.array, [1, 3, 5, 7]);
  });
});

describe("length setters", () => {
  const cases = [
    () => new Vec2(3, 4),
    () => new Vec3(2, 3, 6),
    () => new Vec4(1, 2, 2, 4),
  ];

  it("lengthSquared sets the squared length and keeps the direction", () => {
    for (const make of cases) {
      const v = make();
      const before = v.clone().normalise();
      v.lengthSquared = 4;
      expect(v.lengthSquared).toBeCloseTo(4);
      expectArrayClose(v.clone().normalise().array, before.array);
    }
  });

  it("leaves a zero vector at zero without storing NaN", () => {
    for (const v of [new Vec2(), new Vec3(), new Vec4()]) {
      v.length = 5;
      v.lengthSquared = 5;
      expect(v.array.every((n) => Object.is(n, 0))).toBe(true);
    }
  });
});

describe("component setters", () => {
  it("don't store NaN", () => {
    const v = new Vec3(1, 2, 3);
    v.x = NaN;
    v.x += 1;
    expect(v.x).toBe(1);

    const w = new Vec4(1, 2, 3, 4);
    w.w = NaN;
    w.w += 1;
    expect(w.w).toBe(1);

    const u = new Vec2(1, 2);
    u.y = NaN;
    u.y += 1;
    expect(u.y).toBe(1);
  });
});

describe("cross", () => {
  it("Vec3.cross changes the vector in place and crossNew doesn't", () => {
    const a = new Vec3(1, 0, 0);
    const r = a.cross(new Vec3(0, 1, 0));
    expect(r).toBe(a);
    expectArrayClose(a.array, [0, 0, 1]);

    const b = new Vec3(1, 0, 0);
    const c = b.crossNew(new Vec3(0, 1, 0));
    expectArrayClose(b.array, [1, 0, 0]);
    expectArrayClose(c.array, [0, 0, 1]);
  });

  it("Vec4.cross changes the vector in place and crossNew doesn't", () => {
    const x = new Vec4(1, 0, 0, 0);
    const y = new Vec4(0, 1, 0, 0);
    const z = new Vec4(0, 0, 1, 0);

    const n = x.crossNew(y, z);
    expectArrayClose(x.array, [1, 0, 0, 0]);
    expect(n.dot(x)).toBeCloseTo(0);
    expect(n.dot(y)).toBeCloseTo(0);
    expect(n.dot(z)).toBeCloseTo(0);
    expect(n.length).toBeCloseTo(1);

    const r = x.cross(y, z);
    expect(r).toBe(x);
    expectArrayClose(x.array, n.array);
  });
});

describe("getAngle", () => {
  it("Vec4.getAngle is the angle between two 4D vectors", () => {
    expect(Vec4.getAngle(new Vec4(1, 0, 0, 0), new Vec4(0, 1, 0, 0))).toBeCloseTo(Math.PI / 2);
    expect(Vec4.getAngle(new Vec4(1, 0, 0, 0), new Vec4(-2, 0, 0, 0))).toBeCloseTo(Math.PI);
    expect(Vec4.getAngle(new Vec4(1, 1, 0, 0), new Vec4(3, 0, 0, 0))).toBeCloseTo(Math.PI / 4);
  });

  it("Vec4.getAngle doesn't return NaN when rounding pushes the cosine past 1", () => {
    const a = new Vec4(0.1, 0.2, 0.3, 0.4).normalise();
    expect(Number.isNaN(Vec4.getAngle(a, a.clone()))).toBe(false);
    expect(Vec4.getAngle(a, a.clone())).toBeCloseTo(0);
  });

  it("Quat.getAngle is still the rotation between two quaternions, without NaN", () => {
    const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
    expect(Quat.getAngle(new Quat(), q)).toBeCloseTo(Math.PI / 2);
    const r = Quat.fromAxisAngle(new Vec3(0.3, 0.5, 0.8).normalise(), 1.234);
    expect(Number.isNaN(Quat.getAngle(r, r.clone()))).toBe(false);
  });
});

describe("inverse", () => {
  it("turns a zero component into 0, like divide", () => {
    expectArrayClose(new Vec2(2, 0).inverse().array, [0.5, 0]);
    expectArrayClose(new Vec3(0, 4, 0).inverseNew().array, [0, 0.25, 0]);
    expectArrayClose(new Vec4(0, 0, 0, 5).inverse().array, [0, 0, 0, 0.2]);
  });
});

describe("Vec2.slope", () => {
  it("keeps a vector that points left on the left", () => {
    const v = new Vec2(-2, 0);
    v.slope = 1;
    expect(v.x).toBeLessThan(0);
    expect(v.slope).toBeCloseTo(1);
    expect(v.length).toBeCloseTo(2);
  });

  it("still works for a vector that points right", () => {
    const v = new Vec2(2, 0);
    v.slope = -1;
    expect(v.x).toBeGreaterThan(0);
    expect(v.slope).toBeCloseTo(-1);
  });
});
