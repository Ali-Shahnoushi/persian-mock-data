export type Seed = number | string;

export interface Random {
  float(): number;
  integer(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
  digits(length: number): string;
}

function hashSeed(seed: Seed): number {
  const text = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Creates a compact Mulberry32-based random source. The same seed always
 * produces the same sequence across supported JavaScript runtimes.
 */
export function createRandom(seed: Seed = Date.now()): Random {
  let state = hashSeed(seed);

  const float = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };

  return {
    float,
    integer(min, max) {
      if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
        throw new RangeError("integer() requires integer bounds with max >= min");
      }

      return Math.floor(float() * (max - min + 1)) + min;
    },
    pick<T>(values: readonly T[]): T {
      if (values.length === 0) {
        throw new RangeError("pick() requires at least one value");
      }

      return values[Math.floor(float() * values.length)] as T;
    },
    digits(length) {
      if (!Number.isInteger(length) || length < 0) {
        throw new RangeError("digits() requires a non-negative integer length");
      }

      return Array.from({ length }, () => Math.floor(float() * 10)).join("");
    },
  };
}
