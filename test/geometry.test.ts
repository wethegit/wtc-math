import { describe, expect, it } from "vitest";
import { Plane } from "../src/Plane.js";
import { Ray } from "../src/Ray.js";
import { expectArrayClose } from "./helpers.js";

const ground = () => new Plane([0, 1, 0], 0);

describe("Plane", () => {
  it("gives a signed distance on either side", () => {
    expect(ground().distanceTo([3, 2, -1])).toBeCloseTo(2);
    expect(ground().distanceTo([3, -5, -1])).toBeCloseTo(-5);
  });

  it("projects a point onto its surface", () => {
    expectArrayClose(ground().projectPoint([3, 2, -1]).array, [3, 0, -1]);
  });

  it("passes through the points it was built from", () => {
    const pts: [number, number, number][] = [[1, 2, 3], [4, 0, -1], [-2, 5, 2]];
    const p = Plane.fromPoints(pts[0], pts[1], pts[2]);
    for (const pt of pts) expect(p.distanceTo(pt)).toBeCloseTo(0);
  });

  it("intersects a segment that crosses it, and not one that doesn't", () => {
    expectArrayClose(ground().intersectLine([1, 2, 1], [1, -2, 1])!.array, [1, 0, 1]);
    expect(ground().intersectLine([1, 2, 1], [1, 1, 1])).toBeNull();
  });
});

describe("Ray", () => {
  it("normalises its direction", () => {
    expect(new Ray([0, 0, 0], [0, 0, -10]).direction.length).toBeCloseTo(1);
  });

  it("hits a plane in front of it", () => {
    const hit = new Ray([2, 5, 1], [0, -1, 0]).intersectPlane(ground());
    expectArrayClose(hit!.array, [2, 0, 1]);
  });

  it("misses a plane that is parallel or behind it", () => {
    expect(new Ray([0, 5, 0], [1, 0, 0]).intersectPlane(ground())).toBeNull();
    expect(new Ray([0, 5, 0], [0, 1, 0]).intersectPlane(ground())).toBeNull();
  });

  it("hits the near side of a sphere", () => {
    const hit = new Ray([0, 0, 10], [0, 0, -1]).intersectSphere([0, 0, 0], 2);
    expectArrayClose(hit!.array, [0, 0, 2]);
  });

  it("misses a sphere it passes beside", () => {
    expect(new Ray([5, 0, 10], [0, 0, -1]).intersectSphere([0, 0, 0], 2)).toBeNull();
  });

  it("hits the near face of a box", () => {
    const hit = new Ray([0.5, 0.5, 10], [0, 0, -1]).intersectBox([0, 0, 0], [1, 1, 1]);
    expectArrayClose(hit!.array, [0.5, 0.5, 1]);
  });
});
