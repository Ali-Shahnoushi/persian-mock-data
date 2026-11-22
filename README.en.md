# Persian Mock Data Factory

[مستندات فارسی](./README.md)

A framework-agnostic TypeScript library for deterministic Iranian mock data,
named invalid scenarios, and frontend form edge-case testing.

> The library creates data that satisfies its **documented format and
> algorithm rules**. It does not assert that a person exists, a phone is
> reachable, a national ID is officially assigned, or a postal code is
> deliverable.

## Project status

The `0.1.0` core is implemented, but the package has not been published to npm.
For local development:

```bash
git clone https://github.com/Ali-Shahnoushi/persian-mock-data.git
cd persian-mock-data
npm install
npm run build
```

The build produces ESM, CommonJS, and TypeScript declarations without a UI
framework dependency.

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
```

The same schema and seed always produce the same object. A schema uses one
shared random stream, so the entire fixture is reproducible.

### Target one validation rule

```ts
const invalidId = persianMock.field("identity.nationalId", {
  mode: "invalid",
  scenario: "wrong-checksum",
  seed: 1405,
});

const explained = persianMock.case("phone.mobile", {
  mode: "invalid",
  scenario: "persian-digits",
  seed: 1405,
});

const allPostalCases = persianMock.edgeCases("address.postalCode", 1405);
```

`field()` returns the raw string. `case()` and `edgeCases()` also return
`expectedValid`, the scenario name, and a human-readable `violatedRule`.

## Public API

| API | Purpose |
| --- | --- |
| `persianMock.generate(schema, options)` | Generate form-shaped raw values |
| `persianMock.field(type, options)` | Generate one raw field value |
| `persianMock.case(type, options)` | Generate one value with validity metadata |
| `persianMock.edgeCases(type, seed)` | Generate every invalid scenario for a field |
| `generateFirstName`, `generateLastName`, `generateFullName` | Generate Persian mock names |
| `generateMobile`, `generateLandline` | Generate supported phone formats |
| `generateNationalId`, `generatePostalCode` | Generate identity/address formats |
| `validateMobile`, `validateLandline` | Validate format and supported prefixes |
| `validateNationalId`, `validatePostalCode` | Validate documented rules |
| `createRandom(seed)` | Compose generators with one seeded random source |

Supported field types are `person.firstName`, `person.lastName`,
`person.fullName`, `phone.mobile`, `phone.landline`,
`identity.nationalId`, and `address.postalCode`.

## Validation contracts

### National ID

`validateNationalId` implements the project owner's exact reference behavior:

- The input is exactly 10 ASCII digits.
- `0000000000` and repeated digits from `2222222222` through `9999999999` are
  rejected.
- The first nine digits use weights 10 through 2.
- When `weightedSum % 11` is below 2, the check digit equals that remainder;
  otherwise it equals `11 - remainder`.
- `1111111111` is accepted, matching the reference function. A regression test
  protects this deliberate edge behavior.

No undocumented stricter policy is silently applied.

### Mobile and landline

A mobile is 11 ASCII digits and starts with an explicitly supported four-digit
prefix exported as `MOBILE_PREFIXES`. A landline is 11 ASCII digits, starts
with one of the three-digit areas exported as `LANDLINE_AREAS`, and has an
eight-digit subscriber number beginning with 2 through 8. `generateLandline`
returns matching `value`, `areaCode`, and `province` fields.

These policies validate the package's supported formats; they do not prove
that a number is allocated or reachable.

### Postal code

The format-level policy is 10 ASCII digits with no `0` or `2` in the first five
positions. It does not verify official allocation or deliverability.

## Named invalid scenarios

| Field | Scenarios |
| --- | --- |
| Names | `empty`, `whitespace`, `too-long`, `invisible-character` |
| Mobile | `missing-leading-zero`, `unsupported-prefix`, `too-short`, `non-numeric`, `persian-digits` |
| Landline | `missing-leading-zero`, `unsupported-area`, `too-short`, `non-numeric`, `persian-digits` |
| National ID | `wrong-checksum`, `wrong-length`, `non-numeric`, `persian-digits`, `forbidden-repeated` |
| Postal code | `wrong-length`, `non-numeric`, `invalid-prefix`, `persian-digits` |

TypeScript rejects scenarios that do not belong to a field. Runtime validation
also throws a `RangeError` for incompatible input.

## Development

```bash
npm run check
```

The check runs strict type-checking, the full Vitest suite, and the production
build. See [the implementation plan](./docs/IMPLEMENTATION_PLAN.md) for the
phased design and verification approach.

## License

[MIT](./LICENSE)
