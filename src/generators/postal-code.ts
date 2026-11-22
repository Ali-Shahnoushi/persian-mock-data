import type { RandomSource } from "../core/random";
import { resolveRandom } from "../core/random";

const POSTAL_PREFIX_DIGITS = ["1", "3", "4", "5", "6", "7", "8", "9"] as const;

export function generatePostalCode(source?: RandomSource): string {
  const random = resolveRandom(source);
  const prefix = Array.from({ length: 5 }, () =>
    random.pick(POSTAL_PREFIX_DIGITS),
  ).join("");

  return `${prefix}${random.digits(5)}`;
}
