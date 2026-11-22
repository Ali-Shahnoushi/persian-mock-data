import { describe, expect, it } from "vitest";

import {
  calculateNationalIdCheckDigit,
  createRandom,
  generateFullName,
  generateLandline,
  generateMobile,
  generateNationalId,
  generatePostalCode,
  validateLandline,
  validateMobile,
  validateNationalId,
  validatePostalCode,
} from "../src";

describe("valid mock data", () => {
  it("generates deterministic Persian names", () => {
    expect(generateFullName(1405)).toBe(generateFullName(1405));
    expect(generateFullName(1405)).toMatch(/^[\u0600-\u06ff]+ [\u0600-\u06ff]+$/u);
  });

  it("generates supported Iranian mobile numbers", () => {
    const value = generateMobile(1405);

    expect(value).toMatch(/^09[0-9]{9}$/);
    expect(validateMobile(value)).toBe(true);
    expect(generateMobile(1405)).toBe(value);
  });

  it("generates landlines with matching area metadata", () => {
    const landline = generateLandline(1405);

    expect(landline.value.startsWith(landline.areaCode)).toBe(true);
    expect(landline.province).not.toBe("");
    expect(validateLandline(landline.value)).toBe(true);
  });

  it("rejects unsupported phone formats and prefixes", () => {
    expect(validateMobile("9123456789")).toBe(false);
    expect(validateMobile("09881234567")).toBe(false);
    expect(validateMobile("۰۹۱۲۳۴۵۶۷۸۹")).toBe(false);
    expect(validateLandline("02191234567")).toBe(false);
    expect(validateLandline("09921234567")).toBe(false);
  });

  it("generates format-valid postal codes", () => {
    const value = generatePostalCode(1405);

    expect(value).toMatch(/^[13456789]{5}[0-9]{5}$/);
    expect(validatePostalCode(value)).toBe(true);
    expect(validatePostalCode("1234056789")).toBe(false);
    expect(validatePostalCode("۱۲۳۴۵۶۷۸۹۰")).toBe(false);
  });

  it("calculates and generates national-ID check digits", () => {
    const random = createRandom(1405);
    const values = Array.from({ length: 100 }, () =>
      generateNationalId(random),
    );

    expect(new Set(values).size).toBeGreaterThan(90);
    expect(values.every(validateNationalId)).toBe(true);
    expect(generateNationalId(1405)).toBe(generateNationalId(1405));
    expect(calculateNationalIdCheckDigit("123456789")).toBe(1);
  });
});

describe("national ID reference contract", () => {
  it("accepts 1111111111 exactly as the provided reference does", () => {
    expect(validateNationalId("1111111111")).toBe(true);
  });

  it.each([
    "0000000000",
    "2222222222",
    "3333333333",
    "4444444444",
    "5555555555",
    "6666666666",
    "7777777777",
    "8888888888",
    "9999999999",
  ])("rejects explicitly forbidden repeated value %s", (value) => {
    expect(validateNationalId(value)).toBe(false);
  });

  it("requires exactly 10 ASCII digits", () => {
    expect(validateNationalId("123456789")).toBe(false);
    expect(validateNationalId("12345678901")).toBe(false);
    expect(validateNationalId("۱۲۳۴۵۶۷۸۹۰")).toBe(false);
    expect(validateNationalId("12345678a0")).toBe(false);
  });

  it("rejects an altered check digit", () => {
    const valid = generateNationalId(22);
    const replacement = valid.endsWith("9") ? "0" : "9";

    expect(validateNationalId(`${valid.slice(0, -1)}${replacement}`)).toBe(false);
  });

  it("rejects a malformed national-ID body when calculating", () => {
    expect(() => calculateNationalIdCheckDigit("123")).toThrow(TypeError);
    expect(() => calculateNationalIdCheckDigit("۱۲۳۴۵۶۷۸۹")).toThrow(TypeError);
  });
});
