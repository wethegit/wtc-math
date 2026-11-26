// Regression tests for the matrix and quaternion items in KNOWN-ISSUES.md
import { describe, expect, it } from "vitest";
import { Mat2, Mat3, Mat4, Quat, Vec2, Vec3, Vec4 } from "../src/index.js";
import { expectArrayClose } from "./helpers.js";

describe("rotation direction", () => {
  it("Mat2.fromAngle turns counter-clockwise, like rotate", () => {
    const r = 0.7;
    expectArrayClose(Mat2.fromAngle(r).array, Mat2.identity().rotate(r).array);
    expectArrayClose(new Vec2(1, 0).transformByMat2(Mat2.fromAngle(Math.PI / 2)).array, [0, 1]);
  });

  it("Mat3.fromAngle turns counter-clockwise, like rotate", () => {
    const r = -1.3;
    expectArrayClose(Mat3.fromAngle(r).array, Mat3.identity().rotate(r).array);
    expectArrayClose(new Vec2(1, 0).transformByMat3(Mat3.fromAngle(Math.PI / 2)).array, [0, 1]);
  });

  it("Mat3.fromQuat rotates the same way as the quaternion", () => {
    const q = Quat.fromAxisAngle(new Vec3(0.2, -0.5, 0.8).normalise(), 1.1);
    const v = new Vec3(1, 2, -3);
    expectArrayClose(v.transformByMat3New(Mat3.fromQuat(q)).array, v.transformByQuatNew(q).array);

    const m4 = Mat4.fromQuat(q).array;
    const upper = [m4[0], m4[1], m4[2], m4[4], m4[5], m4[6], m4[8], m4[9], m4[10]];
    expectArrayClose(Mat3.fromQuat(q).array, upper);
  });
});

describe("Mat4", () => {
  it("transformToNew sets the translation and leaves the original alone", () => {
    const m = new Mat4().transformTo([1, 2, 3]);
    const n = m.transformToNew([10, 20, 30]);
    expectArrayClose(n.translation.array, [10, 20, 30]);
    expectArrayClose(m.translation.array, [1, 2, 3]);
  });

  it("rotation is right for a non-uniform scale", () => {
    const q = Quat.fromAxisAngle(new Vec3(0.3, 0.9, -0.2).normalise(), 0.8);
    const m = Mat4.fromRotationTranslationScale(q, [1, 2, 3], [1, 4, 0.5]);
    const r = m.rotation;
    // q and -q are the same rotation
    const sign = Math.sign(r.dot(q)) || 1;
    expectArrayClose(r.array.map((n) => n * sign), q.array);
  });

  it("fromRotation accepts any Vec3Like axis", () => {
    expectArrayClose(Mat4.fromRotation(Math.PI / 2, [0, 0, 1]).array, Mat4.fromZRotation(Math.PI / 2).array);
    expectArrayClose(Mat4.fromRotation(Math.PI / 2, new Vec3(0, 0, 1)).array, Mat4.fromZRotation(Math.PI / 2).array);
  });
});

describe("columnArray", () => {
  it("is column-major, the same as array, on Mat2 and Mat3", () => {
    const m2 = new Mat2(1, 2, 3, 4);
    expect(m2.columnArray).toEqual(m2.array);
    expect(m2.rowArray).toEqual([1, 3, 2, 4]);

    const m3 = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    expect(m3.columnArray).toEqual(m3.array);
    expect(m3.rowArray).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
  });
});

describe("Mat3.translate", () => {
  it("accepts an array and has a New form", () => {
    const m = new Mat3();
    const n = m.translateNew([2, 3]);
    expectArrayClose(m.array, Mat3.identity().array);
    expectArrayClose(new Vec2(1, 1).transformByMat3(n).array, [3, 4]);
    m.translate([2, 3]);
    expectArrayClose(m.array, n.array);
  });
});

describe("Quat", () => {
  it("inverse is the quaternion inverse, not the component-wise reciprocal", () => {
    const q = new Quat(1, 2, 3, 4);
    const expected = q.invertNew();
    expectArrayClose(q.inverseNew().array, expected.array);
    expectArrayClose(q.inverse().array, expected.array);
  });

  it("lerp and interpolate return a Quat", () => {
    const a = new Quat();
    const b = Quat.fromAxisAngle(new Vec3(0, 1, 0), 1);
    expect(Quat.lerp(a, b, 0.5) instanceof Quat).toBe(true);
    expect(Quat.interpolate([0, 0, 0, 1]) instanceof Quat).toBe(true);
    expect(Quat.interpolate(new Vec4(0, 0, 0, 1)) instanceof Quat).toBe(true);
    expectArrayClose(Quat.interpolate([1, 2, 3, 4]).array, [1, 2, 3, 4]);
  });
});
