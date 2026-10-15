import { describe, expect, it } from "vitest";
import { Vec2, Vec3 } from "../src/index.js";
import { expectArrayClose, random } from "./helpers.js";

const randomVec3 = () => new Vec3(random(), random(), random());

describe("Vec2", () => {
  it("adds and subtracts component-wise", () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, -5);
    expectArrayClose(a.addNew(b).array, [4, -3]);
    expectArrayClose(a.subtractNew(b).array, [-2, 7]);
  });

  it("leaves the original alone in *New methods", () => {
    const a = new Vec2(1, 2);
    a.addNew(new Vec2(5, 5));
    expectArrayClose(a.array, [1, 2]);
  });

  it("normalises to unit length", () => {
    expect(new Vec2(3, 4).normaliseNew().length).toBeCloseTo(1);
  });

  it("computes the 2D cross product", () => {
    expect(new Vec2(2, -3).cross(new Vec2(-4, 2))).toBeCloseTo(-8);
  });

  it("lerps between two vectors", () => {
    expectArrayClose(Vec2.lerp(new Vec2(0, 0), new Vec2(10, -4), 0.25).array, [2.5, -1]);
  });
});

describe("Vec3", () => {
  it("reports its length", () => {
    expect(new Vec3(2, 3, 6).length).toBeCloseTo(7);
  });

  it("produces a cross product perpendicular to both inputs", () => {
    for (let i = 0; i < 20; i++) {
      const a = randomVec3();
      const b = randomVec3();
      const c = a.crossNew(b);
      expect(c.dot(a)).toBeCloseTo(0);
      expect(c.dot(b)).toBeCloseTo(0);
    }
  });

  it("follows the right-hand rule for the basis vectors", () => {
    expectArrayClose(new Vec3(1, 0, 0).crossNew(new Vec3(0, 1, 0)).array, [0, 0, 1]);
  });

  it("normalises to unit length", () => {
    for (let i = 0; i < 20; i++) expect(randomVec3().normaliseNew().length).toBeCloseTo(1);
  });

  it("accepts arrays, numbers and vectors via interpolate", () => {
    expectArrayClose(Vec3.interpolate([1, 2, 3]).array, [1, 2, 3]);
    expectArrayClose(Vec3.interpolate(new Vec3(4, 5, 6)).array, [4, 5, 6]);
  });

  it("lerps between two vectors", () => {
    expectArrayClose(Vec3.lerp(new Vec3(0, 0, 0), new Vec3(2, 4, -6), 0.5).array, [1, 2, -3]);
  });
});
