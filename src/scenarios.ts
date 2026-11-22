import type { FieldType } from "./types";

export const INVALID_SCENARIOS = {
  "person.firstName": [
    "empty",
    "whitespace",
    "too-long",
    "invisible-character",
  ],
  "person.lastName": [
    "empty",
    "whitespace",
    "too-long",
    "invisible-character",
  ],
  "person.fullName": [
    "empty",
    "whitespace",
    "too-long",
    "invisible-character",
  ],
  "phone.mobile": [
    "missing-leading-zero",
    "unsupported-prefix",
    "too-short",
    "non-numeric",
    "persian-digits",
  ],
  "phone.landline": [
    "missing-leading-zero",
    "unsupported-area",
    "too-short",
    "non-numeric",
    "persian-digits",
  ],
  "identity.nationalId": [
    "wrong-checksum",
    "wrong-length",
    "non-numeric",
    "persian-digits",
    "forbidden-repeated",
  ],
  "address.postalCode": [
    "wrong-length",
    "non-numeric",
    "invalid-prefix",
    "persian-digits",
  ],
} as const satisfies Record<FieldType, readonly string[]>;

export type InvalidScenario<T extends FieldType> =
  (typeof INVALID_SCENARIOS)[T][number];

export const VIOLATED_RULES: Record<FieldType, Record<string, string>> = {
  "person.firstName": {
    empty: "Value must not be empty.",
    whitespace: "Value must contain visible Persian letters.",
    "too-long": "Value must not exceed 100 characters.",
    "invisible-character": "Value must not contain zero-width characters.",
  },
  "person.lastName": {
    empty: "Value must not be empty.",
    whitespace: "Value must contain visible Persian letters.",
    "too-long": "Value must not exceed 100 characters.",
    "invisible-character": "Value must not contain zero-width characters.",
  },
  "person.fullName": {
    empty: "Value must not be empty.",
    whitespace: "Value must contain visible Persian letters.",
    "too-long": "Value must not exceed 100 characters.",
    "invisible-character": "Value must not contain zero-width characters.",
  },
  "phone.mobile": {
    "missing-leading-zero": "Mobile numbers must begin with 0.",
    "unsupported-prefix": "Mobile prefix must be in the supported-prefix list.",
    "too-short": "Mobile numbers must contain exactly 11 ASCII digits.",
    "non-numeric": "Mobile numbers must contain ASCII digits only.",
    "persian-digits": "Mobile numbers must use ASCII digits, not Persian digits.",
  },
  "phone.landline": {
    "missing-leading-zero": "Landlines must begin with the trunk prefix 0.",
    "unsupported-area": "Landline area code must be supported.",
    "too-short": "Landlines must contain exactly 11 ASCII digits.",
    "non-numeric": "Landlines must contain ASCII digits only.",
    "persian-digits": "Landlines must use ASCII digits, not Persian digits.",
  },
  "identity.nationalId": {
    "wrong-checksum": "The final digit must satisfy the Mod-11 checksum.",
    "wrong-length": "National IDs must contain exactly 10 ASCII digits.",
    "non-numeric": "National IDs must contain ASCII digits only.",
    "persian-digits": "National IDs must use ASCII digits, not Persian digits.",
    "forbidden-repeated": "This repeated-digit value is explicitly forbidden.",
  },
  "address.postalCode": {
    "wrong-length": "Postal codes must contain exactly 10 ASCII digits.",
    "non-numeric": "Postal codes must contain ASCII digits only.",
    "invalid-prefix": "The first five postal-code digits must exclude 0 and 2.",
    "persian-digits": "Postal codes must use ASCII digits, not Persian digits.",
  },
};
