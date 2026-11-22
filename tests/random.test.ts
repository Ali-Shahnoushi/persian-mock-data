import { describe, expect, it } from "vitest";

import { createRandom } from "../src";

describe("createRandom", () => {
  it("reproduces the same sequence for the same seed", () => {
    const first = createRandom(1405);
    const second = createRandom(1405);

    expect(Array.from({ length: 5 }, () => first.float())).toEqual(
      Array.from({ length: 5 }, () => second.float()),
    );
  });

  it("supports stable string seeds", () => {
    expect(createRandom("tehran").digits(12)).toBe(
      createRandom("tehran").digits(12),
    );
  });

  it("returns inclusive integers and values from the supplied list", () => {
    const random = createRandom(42);

    for (let index = 0; index < 100; index += 1) {
      expect(random.integer(3, 5)).toBeGreaterThanOrEqual(3);
      expect(random.integer(3, 5)).toBeLessThanOrEqual(5);
      expect(["الف", "ب"]).toContain(random.pick(["الف", "ب"]));
    }
  });

  it("rejects impossible requests", () => {
    const random = createRandom(1);

    expect(() => random.integer(2, 1)).toThrow(RangeError);
    expect(() => random.pick([])).toThrow(RangeError);
    expect(() => random.digits(-1)).toThrow(RangeError);
  });
});
