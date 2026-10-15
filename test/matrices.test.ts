import { describe, expect, it } from "vitest";
import { Mat3, Mat4, Quat, Vec3 } from "../src/index.js";
import { expectArrayClose, IDENTITY_3, IDENTITY_4, random } from "./helpers.js";

// A rotation, translation and scale, like an object's matrix
const randomTransform = () =>
  Mat4.fromRotationTranslationScale(
    Quat.fromEuler(new Vec3(random(), random(), random())),
    new Vec3(random(), random(), random()),
    new Vec3(random(1, 3), random(1, 3), random(1, 3))
  );

const singularMat4 = () => new Mat4(1, 2, 3, 4, 2, 4, 6, 8, 0, 1, 0, 1, 1, 0, 1, 0);

describe("Mat4", () => {
  it("defaults to the identity", () => {
    expectArrayClose(new Mat4().array, IDENTITY_4);
  });

  it("gives the identity when multiplied by its inverse", () => {
    for (let i = 0; i < 20; i++) {
      const m = randomTransform();
      expectArrayClose(m.multiplyNew(m.invertNew()).array, IDENTITY_4);
    }
  });

  it("has a determinant equal to the product of its scale", () => {
    const m = Mat4.fromRotationTranslationScale(Quat.fromEuler([0.3, 1.1, -0.4]), [5, -2, 1], [2, 3, 0.5]);
    expect(m.determinant).toBeCloseTo(3);
  });

  it("leaves a singular matrix unchanged when inverting", () => {
    const m = singularMat4();
    expect(m.determinant).toBeCloseTo(0);
    expectArrayClose(m.invertNew().array, singularMat4().array);
  });

  it("transposes twice back to the original", () => {
    const m = randomTransform();
    expectArrayClose(m.clone().transpose().transpose().array, m.array);
  });
});

describe("Mat3", () => {
  it("gives the identity when multiplied by its inverse", () => {
    const m = new Mat3(2, 0, 1, 1, 3, 0, 0, 1, 4);
    expectArrayClose(m.multiplyNew(m.invertNew()).array, IDENTITY_3);
  });

  it("returns null from fromMat4 for a singular matrix", () => {
    expect(Mat3.fromMat4(singularMat4())).toBeNull();
  });

  it("builds a normal matrix from an invertible Mat4", () => {
    // For a pure rotation the normal matrix is the rotation itself
    const q = Quat.fromEuler([0.2, -0.7, 1.3]);
    const m = Mat4.fromRotationTranslationScale(q, [0, 0, 0], [1, 1, 1]);
    const n = Mat3.fromMat4(m);
    expect(n).not.toBeNull();
    const a = m.array;
    expectArrayClose(n!.array, [a[0], a[1], a[2], a[4], a[5], a[6], a[8], a[9], a[10]]);
  });
});

describe("Quat", () => {
  it("produces unit quaternions from Euler angles", () => {
    for (let i = 0; i < 20; i++) {
      expect(Quat.fromEuler([random(), random(), random()]).length).toBeCloseTo(1);
    }
  });

  it("matches an axis-angle rotation for a single-axis Euler", () => {
    const a = 0.9;
    expectArrayClose(Quat.fromEuler([0, a, 0]).array, Quat.fromAxisAngle(new Vec3(0, 1, 0), a).array);
  });

  it("gives the identity when multiplied by its inverse", () => {
    const q = Quat.fromEuler([0.4, -1.2, 2.0]);
    expectArrayClose(q.multiplyNew(q.invertNew()).array, Quat.identity().array);
  });

  it("preserves length when rotating a vector", () => {
    const q = Quat.fromEuler([0.4, -1.2, 2.0]);
    const v = new Vec3(1, -2, 3);
    expect(v.clone().transformByQuat(q).length).toBeCloseTo(v.length);
  });
});
