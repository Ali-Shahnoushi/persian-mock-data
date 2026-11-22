import type { RandomSource } from "../core/random";
import { resolveRandom } from "../core/random";
import { LANDLINE_AREAS, MOBILE_PREFIXES } from "../data/phone";

export interface GeneratedLandline {
  areaCode: string;
  province: string;
  value: string;
}

export function generateMobile(source?: RandomSource): string {
  const random = resolveRandom(source);
  return `${random.pick(MOBILE_PREFIXES)}${random.digits(7)}`;
}

export function generateLandline(source?: RandomSource): GeneratedLandline {
  const random = resolveRandom(source);
  const area = random.pick(LANDLINE_AREAS);
  const subscriberNumber = `${random.integer(2, 8)}${random.digits(7)}`;

  return {
    areaCode: area.code,
    province: area.province,
    value: `${area.code}${subscriberNumber}`,
  };
}
