# Persian Mock Data

[![npm version](https://img.shields.io/npm/v/persian-mock-data.svg)](https://www.npmjs.com/package/persian-mock-data)
[![npm downloads](https://img.shields.io/npm/dm/persian-mock-data.svg)](https://www.npmjs.com/package/persian-mock-data)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6.svg)](https://www.typescriptlang.org/)

Deterministic, framework-agnostic TypeScript utilities for generating and
validating Iranian mock data. Use it to create realistic-looking Persian names,
mobile and landline numbers, national IDs, postal codes, and intentional invalid
inputs for form and validation testing.

> [!IMPORTANT]
> This library generates **test data that follows documented format rules**. It
> does not confirm that a person exists, a national ID is officially assigned,
> a phone number is reachable, or a postal code is deliverable.

## Features

- Framework-independent TypeScript API
- ESM and CommonJS support
- Complete TypeScript declarations
- Reproducible output using number or string seeds
- Persian first names, last names, and full names
- Iranian mobile and landline formats
- Iranian national-ID generation and Mod-11 validation
- Format-level Iranian postal-code generation and validation
- Named invalid scenarios for negative tests
- Explanatory metadata for intentionally invalid values
- Schema-based generation for complete form fixtures
- No runtime dependencies

## Requirements

- Node.js 18 or newer

## Installation

### npm

```bash
npm install persian-mock-data
```

### pnpm

```bash
pnpm add persian-mock-data
```

### Yarn

```bash
yarn add persian-mock-data
```

### From GitHub

Clone the repository when you want to contribute or work with the latest source:

```bash
git clone https://github.com/Ali-Shahnoushi/persian-mock-data.git
cd persian-mock-data
npm install
npm run build
```

## Quick start

```ts
import { persianMock } from "persian-mock-data";

const user = persianMock.generate(
  {
    fullName: { type: "person.fullName" },
    mobile: { type: "phone.mobile" },
    landline: { type: "phone.landline" },
    nationalId: { type: "identity.nationalId" },
    postalCode: { type: "address.postalCode" },
  },
  { seed: 1405 },
);

console.log(user);
```

The same schema and seed always produce the same object. All fields in a schema
share one seeded random stream, so the complete fixture is reproducible.

## Module formats

### ESM and TypeScript

```ts
import {
  generateMobile,
  persianMock,
  validateMobile,
} from "persian-mock-data";
```

### CommonJS

```js
const {
  generateMobile,
  persianMock,
  validateMobile,
} = require("persian-mock-data");
```

## Generate individual fields

Every generator accepts an optional number seed, string seed, or shared random
source.

```ts
import {
  generateFirstName,
  generateFullName,
  generateLandline,
  generateLastName,
  generateMobile,
  generateNationalId,
  generatePostalCode,
} from "persian-mock-data";

const firstName = generateFirstName(1405);
const lastName = generateLastName(1405);
const fullName = generateFullName(1405);
const mobile = generateMobile(1405);
const nationalId = generateNationalId(1405);
const postalCode = generatePostalCode(1405);

const landline = generateLandline(1405);
// {
//   value: "...",
//   areaCode: "...",
//   province: "..."
// }
```

You can also generate a raw field value through the unified API:

```ts
const mobile = persianMock.field("phone.mobile", { seed: "signup-form" });
const nationalId = persianMock.field("identity.nationalId", { seed: 1405 });
```

## Generate complete form data

```ts
const registrationData = persianMock.generate(
  {
    firstName: { type: "person.firstName" },
    lastName: { type: "person.lastName" },
    mobile: { type: "phone.mobile" },
    nationalId: { type: "identity.nationalId" },
    postalCode: { type: "address.postalCode" },
  },
  { seed: "registration-test-1" },
);
```

Supported field types:

```ts
type FieldType =
  | "person.firstName"
  | "person.lastName"
  | "person.fullName"
  | "phone.mobile"
  | "phone.landline"
  | "identity.nationalId"
  | "address.postalCode";
```

## Generate invalid and edge-case data

Use named scenarios to target one validation rule at a time:

```ts
const invalidNationalId = persianMock.field("identity.nationalId", {
  mode: "invalid",
  scenario: "wrong-checksum",
  seed: 1405,
});

const persianDigitMobile = persianMock.field("phone.mobile", {
  mode: "invalid",
  scenario: "persian-digits",
  seed: 1405,
});
```

Use `case()` when your test needs metadata explaining the result:

```ts
const generatedCase = persianMock.case("phone.mobile", {
  mode: "invalid",
  scenario: "unsupported-prefix",
  seed: 1405,
});

// {
//   type: "phone.mobile",
//   value: "...",
//   expectedValid: false,
//   scenario: "unsupported-prefix",
//   violatedRule: "Mobile prefix must be in the supported-prefix list."
// }
```

Generate every supported invalid scenario for a field:

```ts
const nationalIdCases = persianMock.edgeCases("identity.nationalId", 1405);
const postalCodeCases = persianMock.edgeCases("address.postalCode", 1405);
```

Generate a form in invalid mode while selecting scenarios per field:

```ts
const invalidForm = persianMock.generate(
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
  { mode: "invalid", seed: 1405 },
);
```

## Invalid scenario reference

| Field | Available scenarios |
| --- | --- |
| Persian names | `empty`, `whitespace`, `too-long`, `invisible-character` |
| Mobile | `missing-leading-zero`, `unsupported-prefix`, `too-short`, `non-numeric`, `persian-digits` |
| Landline | `missing-leading-zero`, `unsupported-area`, `too-short`, `non-numeric`, `persian-digits` |
| National ID | `wrong-checksum`, `wrong-length`, `non-numeric`, `persian-digits`, `forbidden-repeated` |
| Postal code | `wrong-length`, `non-numeric`, `invalid-prefix`, `persian-digits` |

TypeScript prevents selecting a scenario that does not belong to the selected
field. The runtime API also throws a `RangeError` for incompatible scenarios.

## Validation

```ts
import {
  validateLandline,
  validateMobile,
  validateNationalId,
  validatePersianName,
  validatePostalCode,
} from "persian-mock-data";

validatePersianName("مریم احمدی");
validateMobile("09123456789");
validateLandline("02123456789");
validateNationalId("1111111111");
validatePostalCode("1345678901");
```

### National ID contract

`validateNationalId()` implements the project owner's reference behavior:

1. The input must contain exactly 10 ASCII digits.
2. `0000000000` and repeated values from `2222222222` through `9999999999`
   are rejected.
3. The first nine digits are multiplied by weights 10 through 2.
4. When `weightedSum % 11` is less than 2, the check digit equals the
   remainder. Otherwise, it equals `11 - remainder`.
5. `1111111111` is accepted, matching the reference implementation.

The library deliberately does not apply an undocumented stricter policy.

### Mobile contract

A mobile value must contain 11 ASCII digits and start with one of the prefixes
exported through `MOBILE_PREFIXES`. This is a supported-format check, not proof
that the number is allocated or reachable.

### Landline contract

A landline value must contain 11 ASCII digits, begin with an area code exported
through `LANDLINE_AREAS`, and have an eight-digit subscriber number beginning
with a digit from 2 through 8.

### Postal-code contract

A postal code must contain 10 ASCII digits. The first five positions must not
contain `0` or `2`. This is a format-level rule and does not prove official
allocation or deliverability.

## Shared seeded random source

Use one random source when composing generators manually:

```ts
import {
  createRandom,
  generateFullName,
  generateMobile,
  generateNationalId,
} from "persian-mock-data";

const random = createRandom("checkout-fixture");

const fixture = {
  fullName: generateFullName(random),
  mobile: generateMobile(random),
  nationalId: generateNationalId(random),
};
```

## API reference

| Export | Description |
| --- | --- |
| `persianMock.generate()` | Generate raw values matching an object schema |
| `persianMock.field()` | Generate one raw valid or invalid field value |
| `persianMock.case()` | Generate one field with validity metadata |
| `persianMock.edgeCases()` | Generate all invalid scenarios for one field |
| `createRandom()` | Create a deterministic random source |
| `generateFirstName()` | Generate a Persian first name |
| `generateLastName()` | Generate a Persian last name |
| `generateFullName()` | Generate a Persian full name |
| `generateMobile()` | Generate a supported Iranian mobile format |
| `generateLandline()` | Generate a landline with area metadata |
| `generateNationalId()` | Generate a national ID accepted by the reference validator |
| `calculateNationalIdCheckDigit()` | Calculate a check digit from nine ASCII digits |
| `generatePostalCode()` | Generate a format-valid postal code |
| `validatePersianName()` | Validate the supported Persian-name policy |
| `validateMobile()` | Validate mobile format and supported prefix |
| `validateLandline()` | Validate landline format and supported area |
| `validateNationalId()` | Validate the documented national-ID algorithm |
| `validatePostalCode()` | Validate the documented postal-code format |
| `MOBILE_PREFIXES` | Inspect the supported mobile-prefix policy |
| `LANDLINE_AREAS` | Inspect supported landline areas and provinces |
| `INVALID_SCENARIOS` | Inspect available invalid scenarios |
| `VIOLATED_RULES` | Inspect human-readable validation-rule descriptions |

## Development

```bash
git clone https://github.com/Ali-Shahnoushi/persian-mock-data.git
cd persian-mock-data
npm install
npm run check
```

Available commands:

```bash
npm run typecheck   # Strict TypeScript check
npm test            # Run the test suite once
npm run test:watch  # Run tests in watch mode
npm run build       # Build ESM, CommonJS, and declarations
npm run check       # Type-check, test, and build
```

## Contributing

Issues and pull requests are welcome. When adding or changing a validation
rule, please include tests and document what the rule verifies—and what it does
not verify.

- [Report an issue](https://github.com/Ali-Shahnoushi/persian-mock-data/issues)
- [View the source](https://github.com/Ali-Shahnoushi/persian-mock-data)
- [View the npm package](https://www.npmjs.com/package/persian-mock-data)

## License

Released under the [MIT License](./LICENSE).
