import { LANDLINE_AREAS, MOBILE_PREFIXES } from "../data/phone";

const MOBILE_PREFIX_SET = new Set<string>(MOBILE_PREFIXES);
const LANDLINE_AREA_SET = new Set<string>(
  LANDLINE_AREAS.map((area) => area.code),
);

export function validateMobile(value: string): boolean {
  return /^[0-9]{11}$/.test(value) && MOBILE_PREFIX_SET.has(value.slice(0, 4));
}

export function validateLandline(value: string): boolean {
  return (
    /^[0-9]{11}$/.test(value) &&
    LANDLINE_AREA_SET.has(value.slice(0, 3)) &&
    /^[2-8]$/.test(value[3] ?? "")
  );
}
