import { describe, expect, it } from "vitest";

import {
  INVALID_SCENARIOS,
  persianMock,
  validateLandline,
  validateMobile,
  validateNationalId,
  validatePersianName,
  validatePostalCode,
  type FieldType,
} from "../src";

const validators: Record<FieldType, (value: string) => boolean> = {
  "person.firstName": validatePersianName,
  "person.lastName": validatePersianName,
  "person.fullName": validatePersianName,
  "phone.mobile": validateMobile,
  "phone.landline": validateLandline,
  "identity.nationalId": validateNationalId,
  "address.postalCode": validatePostalCode,
};

describe("named invalid scenarios", () => {
  for (const type of Object.keys(INVALID_SCENARIOS) as FieldType[]) {
    it(`generates every ${type} edge case with metadata`, () => {
      const cases = persianMock.edgeCases(type, 1405);

      expect(cases).toHaveLength(INVALID_SCENARIOS[type].length);
      for (const generated of cases) {
        expect(generated.expectedValid).toBe(false);
        expect(generated.scenario).toBeTruthy();
        expect(generated.violatedRule).toBeTruthy();
        expect(validators[type](generated.value)).toBe(false);
      }
    });
  }

  it("keeps invalid cases reproducible", () => {
    expect(persianMock.edgeCases("phone.mobile", "form-a")).toEqual(
      persianMock.edgeCases("phone.mobile", "form-a"),
    );
  });

  it("creates Persian-digit edge cases without accepting them as ASCII", () => {
    const generated = persianMock.case("identity.nationalId", {
      mode: "invalid",
      scenario: "persian-digits",
      seed: 1405,
    });

    expect(generated.value).toMatch(/^[۰-۹]{10}$/u);
    expect(validateNationalId(generated.value)).toBe(false);
  });
});

describe("persianMock", () => {
  it("returns raw values from field() and explanatory cases from case()", () => {
    const value = persianMock.field("phone.mobile", { seed: 5 });
    const generated = persianMock.case("phone.mobile", { seed: 5 });

    expect(value).toBe(generated.value);
    expect(generated.expectedValid).toBe(true);
    expect(validateMobile(value)).toBe(true);
  });

  it("generates deterministic form-shaped data with one shared seed", () => {
    const schema = {
      fullName: { type: "person.fullName" },
      mobile: { type: "phone.mobile" },
      landline: { type: "phone.landline" },
      nationalId: { type: "identity.nationalId" },
      postalCode: { type: "address.postalCode" },
    } as const;

    const first = persianMock.generate(schema, { seed: 1405 });
    const second = persianMock.generate(schema, { seed: 1405 });

    expect(first).toEqual(second);
    expect(validatePersianName(first.fullName)).toBe(true);
    expect(validateMobile(first.mobile)).toBe(true);
    expect(validateLandline(first.landline)).toBe(true);
    expect(validateNationalId(first.nationalId)).toBe(true);
    expect(validatePostalCode(first.postalCode)).toBe(true);
  });

  it("supports global invalid mode and per-field scenario overrides", () => {
    const generated = persianMock.generate(
      {
        mobile: {
          type: "phone.mobile",
          scenario: "unsupported-prefix",
        },
        nationalId: {
          type: "identity.nationalId",
          scenario: "forbidden-repeated",
        },
      },
      { mode: "invalid", seed: 8 },
    );

    expect(validateMobile(generated.mobile)).toBe(false);
    expect(generated.nationalId).toBe("0000000000");
    expect(validateNationalId(generated.nationalId)).toBe(false);
  });

  it("rejects a scenario that does not belong to a field at runtime", () => {
    expect(() =>
      persianMock.case("phone.mobile", {
        mode: "invalid",
        scenario: "wrong-checksum" as never,
        seed: 1,
      }),
    ).toThrow(/Unsupported scenario/);
  });
});
