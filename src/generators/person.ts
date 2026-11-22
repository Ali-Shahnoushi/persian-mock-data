import type { RandomSource } from "../core/random";
import { resolveRandom } from "../core/random";
import { PERSIAN_FIRST_NAMES, PERSIAN_LAST_NAMES } from "../data/person";

export function generateFirstName(source?: RandomSource): string {
  return resolveRandom(source).pick(PERSIAN_FIRST_NAMES);
}

export function generateLastName(source?: RandomSource): string {
  return resolveRandom(source).pick(PERSIAN_LAST_NAMES);
}

export function generateFullName(source?: RandomSource): string {
  const random = resolveRandom(source);
  return `${generateFirstName(random)} ${generateLastName(random)}`;
}
