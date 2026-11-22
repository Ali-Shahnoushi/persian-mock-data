import type { Random } from "./core/random";
import { createRandom } from "./core/random";
import { generateNationalId } from "./generators/national-id";
import {
  generateFirstName,
  generateFullName,
  generateLastName,
} from "./generators/person";
import { generateLandline, generateMobile } from "./generators/phone";
import { generatePostalCode } from "./generators/postal-code";
import {
  INVALID_SCENARIOS,
  VIOLATED_RULES,
  type InvalidScenario,
} from "./scenarios";
import type {
  FieldOptions,
  FieldType,
  GenerateOptions,
  GeneratedSchema,
  GenerationMode,
  MockCase,
  MockSchema,
} from "./types";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

function validValue(type: FieldType, random: Random): string {
  switch (type) {
    case "person.firstName":
      return generateFirstName(random);
    case "person.lastName":
      return generateLastName(random);
    case "person.fullName":
      return generateFullName(random);
    case "phone.mobile":
      return generateMobile(random);
    case "phone.landline":
      return generateLandline(random).value;
    case "identity.nationalId":
      return generateNationalId(random);
    case "address.postalCode":
      return generatePostalCode(random);
  }
}

function invalidPersonValue(valid: string, scenario: string): string {
  switch (scenario) {
    case "empty":
      return "";
    case "whitespace":
      return "   ";
    case "too-long":
      return "آ".repeat(101);
    case "invisible-character":
      return `${valid}\u200b`;
    default:
      throw new RangeError(`Unsupported person scenario: ${scenario}`);
  }
}

function invalidMobileValue(valid: string, scenario: string): string {
  switch (scenario) {
    case "missing-leading-zero":
      return valid.slice(1);
    case "unsupported-prefix":
      return `0988${valid.slice(4)}`;
    case "too-short":
      return valid.slice(0, -1);
    case "non-numeric":
      return `${valid.slice(0, -1)}x`;
    case "persian-digits":
      return toPersianDigits(valid);
    default:
      throw new RangeError(`Unsupported mobile scenario: ${scenario}`);
  }
}

function invalidLandlineValue(valid: string, scenario: string): string {
  switch (scenario) {
    case "missing-leading-zero":
      return valid.slice(1);
    case "unsupported-area":
      return `099${valid.slice(3)}`;
    case "too-short":
      return valid.slice(0, -1);
    case "non-numeric":
      return `${valid.slice(0, -1)}x`;
    case "persian-digits":
      return toPersianDigits(valid);
    default:
      throw new RangeError(`Unsupported landline scenario: ${scenario}`);
  }
}

function invalidNationalIdValue(valid: string, scenario: string): string {
  switch (scenario) {
    case "wrong-checksum": {
      const checkDigit = Number(valid.at(-1));
      return `${valid.slice(0, -1)}${(checkDigit + 1) % 10}`;
    }
    case "wrong-length":
      return valid.slice(0, -1);
    case "non-numeric":
      return `${valid.slice(0, -1)}x`;
    case "persian-digits":
      return toPersianDigits(valid);
    case "forbidden-repeated":
      return "0000000000";
    default:
      throw new RangeError(`Unsupported national-ID scenario: ${scenario}`);
  }
}

function invalidPostalCodeValue(valid: string, scenario: string): string {
  switch (scenario) {
    case "wrong-length":
      return valid.slice(0, -1);
    case "non-numeric":
      return `${valid.slice(0, -1)}x`;
    case "invalid-prefix":
      return `0${valid.slice(1)}`;
    case "persian-digits":
      return toPersianDigits(valid);
    default:
      throw new RangeError(`Unsupported postal-code scenario: ${scenario}`);
  }
}

function invalidValue(
  type: FieldType,
  valid: string,
  scenario: string,
): string {
  if (type.startsWith("person.")) {
    return invalidPersonValue(valid, scenario);
  }

  switch (type) {
    case "phone.mobile":
      return invalidMobileValue(valid, scenario);
    case "phone.landline":
      return invalidLandlineValue(valid, scenario);
    case "identity.nationalId":
      return invalidNationalIdValue(valid, scenario);
    case "address.postalCode":
      return invalidPostalCodeValue(valid, scenario);
    default:
      throw new RangeError(`Unsupported field type: ${type}`);
  }
}

function generateCase<T extends FieldType>(
  type: T,
  mode: GenerationMode,
  scenario: InvalidScenario<T> | undefined,
  random: Random,
): MockCase<T> {
  const base = validValue(type, random);

  if (mode === "valid") {
    return { type, value: base, expectedValid: true };
  }

  const supported = INVALID_SCENARIOS[type];
  const selected = scenario ?? supported[0];

  if (selected === undefined || !(supported as readonly string[]).includes(selected)) {
    throw new RangeError(
      `Unsupported scenario "${String(selected)}" for ${type}. ` +
        `Expected one of: ${supported.join(", ")}`,
    );
  }

  return {
    type,
    value: invalidValue(type, base, selected),
    expectedValid: false,
    scenario: selected,
    violatedRule: VIOLATED_RULES[type][selected] ?? "Documented field rule.",
  };
}

function fieldCase<T extends FieldType>(
  type: T,
  options: FieldOptions<T> = {},
): MockCase<T> {
  const random = createRandom(options.seed);
  return generateCase(type, options.mode ?? "valid", options.mode === "invalid" ? options.scenario : undefined, random);
}

export const persianMock = {
  field<T extends FieldType>(type: T, options: FieldOptions<T> = {}): string {
    return fieldCase(type, options).value;
  },

  case<T extends FieldType>(type: T, options: FieldOptions<T> = {}): MockCase<T> {
    return fieldCase(type, options);
  },

  edgeCases<T extends FieldType>(type: T, seed?: number | string): MockCase<T>[] {
    const random = createRandom(seed);
    return INVALID_SCENARIOS[type].map((scenario) =>
      generateCase(type, "invalid", scenario, random),
    );
  },

  generate<T extends MockSchema>(
    schema: T,
    options: GenerateOptions = {},
  ): GeneratedSchema<T> {
    const random = createRandom(options.seed);
    const result: Record<string, string> = {};

    for (const [key, definition] of Object.entries(schema)) {
      const mode = definition.mode ?? options.mode ?? "valid";
      const generated = generateCase(
        definition.type,
        mode,
        mode === "invalid" ? definition.scenario : undefined,
        random,
      );
      result[key] = generated.value;
    }

    return result as GeneratedSchema<T>;
  },
};
