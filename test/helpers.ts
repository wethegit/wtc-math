import { expect } from "vitest";

// A deterministic spread of values, so failures are reproducible
let seed = 1;
export const random = (min = -2, max = 2) => {
  seed = (seed * 16807) % 2147483647;
  return min + (seed / 2147483647) * (max - min);
};

export const expectArrayClose = (a: ArrayLike<number>, b: ArrayLike<number>, digits = 6) => {
  expect(a.length).toBe(b.length);
  for (let i = 0; i < a.length; i++) expect(a[i]).toBeCloseTo(b[i], digits);
};

export const IDENTITY_3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const IDENTITY_4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
