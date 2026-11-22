import type { RandomSource } from "../core/random";
import { resolveRandom } from "../core/random";
import { FORBIDDEN_REPEATED_NATIONAL_IDS } from "../validators/national-id";

export function calculateNationalIdCheckDigit(firstNineDigits: string): number {
  if (!/^[0-9]{9}$/.test(firstNineDigits)) {
    throw new TypeError("National ID body must contain exactly 9 ASCII digits");
  }

  const weightedSum = [...firstNineDigits].reduce(
    (total, digit, index) => total + Number(digit) * (10 - index),
    0,
  );
  const remainder = weightedSum % 11;
  return remainder < 2 ? remainder : 11 - remainder;
}

export function generateNationalId(source?: RandomSource): string {
  const random = resolveRandom(source);

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const body = random.digits(9);
    const value = `${body}${calculateNationalIdCheckDigit(body)}`;

    if (!FORBIDDEN_REPEATED_NATIONAL_IDS.has(value)) {
      return value;
    }
  }

  throw new Error("Unable to generate an allowed national ID");
}
