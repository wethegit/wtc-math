// Regression tests for the plane, ray and scalar items in KNOWN-ISSUES.md
import { describe, expect, it } from "vitest";
import { Plane } from "../src/Plane.js";
import { Ray } from "../src/Ray.js";
import { map, pingpong, smootherstep, smoothstep } from "../src/index.js";
import { expectArrayClose } from "./helpers.js";

describe("Ray.intersectBox", () => {
  it("returns the exit point when the ray starts inside the box", () => {
    const hit = new Ray([0, 0, 0], [1, 0, 0]).intersectBox([-1, -1, -1], [2, 1, 1]);
    expect(hit).not.toBeNull();
    expectArrayClose(hit!.array, [2, 0, 0]);
  });

  it("still returns the entry point from outside", () => {
    const hit = new Ray([-5, 0, 0], [1, 0, 0]).intersectBox([-1, -1, -1], [1, 1, 1]);
    expectArrayClose(hit!.array, [-1, 0, 0]);
  });

  it("returns null for a box behind the ray", () => {
    expect(new Ray([5, 0, 0], [1, 0, 0]).intersectBox([-1, -1, -1], [1, 1, 1])).toBeNull();
  });

  it("handles an origin exactly on a slab plane with a zero direction component", () => {
    // Origin on the box's y = 1 face, travelling along x: grazes the top face
    const hit = new Ray([-5, 1, 0], [1, 0, 0]).intersectBox([-1, -1, -1], [1, 1, 1]);
    expect(hit).not.toBeNull();
    expectArrayClose(hit!.array, [-1, 1, 0]);
  });

  it("misses when a zero direction component starts outside that slab", () => {
    expect(new Ray([-5, 2, 0], [1, 0, 0]).intersectBox([-1, -1, -1], [1, 1, 1])).toBeNull();
  });
});

describe("Plane", () => {
  it("normalises a non-unit normal in the constructor, keeping the plane in place", () => {
    // 2y - 4 = 0 is the plane y = 2
    const p = new Plane([0, 2, 0], -4);
    expectArrayClose(p.normal.array, [0, 1, 0]);
    expect(p.constant).toBeCloseTo(-2);
    expect(p.distanceTo([0, 5, 0])).toBeCloseTo(3);
    expectArrayClose(p.projectPoint([1, 7, 1]).array, [1, 2, 1]);
  });

  it("leaves a zero normal alone rather than storing NaN", () => {
    const p = new Plane([0, 0, 0], 1);
    expect(Number.isNaN(p.constant)).toBe(false);
    p.normalize();
    expect(Number.isNaN(p.constant)).toBe(false);
  });
});

describe("scalar functions", () => {
  it("pingpong stays in [0, length] for a negative t", () => {
    expect(pingpong(-0.5, 1)).toBeCloseTo(0.5);
    expect(pingpong(-1.5, 1)).toBeCloseTo(0.5);
    expect(pingpong(-0.25, 1)).toBeCloseTo(0.25);
    expect(pingpong(-2, 1)).toBeCloseTo(0);
  });

  it("map returns outMin instead of dividing by zero when the input range is empty", () => {
    expect(map(3, 2, 2, 10, 20)).toBe(10);
  });

  it("smoothstep and smootherstep step when the edges are equal", () => {
    for (const f of [smoothstep, smootherstep]) {
      expect(f(1, 1, 0.5)).toBe(0);
      expect(f(1, 1, 1)).toBe(1);
      expect(f(1, 1, 2)).toBe(1);
    }
  });
});
