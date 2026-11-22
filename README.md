# Persian Mock Data Factory

**Realistic Iranian mock data and intentionally invalid test cases for frontend forms.**

Persian Mock Data Factory is a planned, open-source, TypeScript-first toolkit for generating **synthetic Iranian data** for UI development, automated form testing, and demos. It aims to go beyond random strings by producing data that follows Iranian formatting and validation rules, supports reproducible edge cases, and can be adapted to different form schemas.

> **Project status:** Planning / initial development. The APIs below are **proposals**, not currently available features.

## Why this project?

Frontend developers building Persian-language applications often need to test more than a happy-path example. A form may handle `09123456789` but fail when a user pastes Persian digits, uses Arabic characters, omits a required field, or enters a value with a deliberately incorrect checksum.

This project has two equally important goals:

1. **Valid-mode fixtures:** Generate data that passes specified *format and algorithm* checks.
2. **Invalid-mode fixtures:** Generate controlled failures for testing validation messages, input constraints, and edge cases.

The project is **not** intended to generate or verify real people's identities, active telephone numbers, or deliverable postal addresses.

## Planned data types

| Category | Examples | Validation or consistency goal |
| --- | --- | --- |
| People | Persian first name, last name, full name | Natural-looking, synthetic names |
| Mobile phones | Iranian mobile number | 11-digit national format and supported prefixes |
| Landlines | Iranian fixed-line number | Area-code and subscriber-number structure |
| National ID (`کد ملی`) | 10-digit national ID | User-provided modulus-11 check-digit algorithm |
| Postal code | 10-digit postal code | Format checks; **not** an address-ownership guarantee |
| Addresses | Province, city, street, alley, building number, unit | Internally consistent synthetic address parts |
| Payments (later) | Card number, IBAN (`شبا`) | Structural/checksum validation only; never real account verification |
| Text and fields | Persian, Arabic, Latin, mixed-direction text | Unicode, length, whitespace, and normalization edge cases |

**Validity levels matter:** `formatValid` means a generated value meets a declared rule; it does **not** mean the value exists in an authoritative registry, belongs to a person, is active, or can receive mail or messages. Location consistency beyond format requires vetted reference data.

## Valid and invalid test cases

Instead of returning an arbitrary bad value, invalid mode should support **named scenarios** so a developer can test one validation rule at a time.

| Field | Valid case | Invalid scenarios (examples) |
| --- | --- | --- |
| National ID | Ten ASCII digits; checksum passes the chosen algorithm | Wrong checksum, wrong length, non-digits, repeated digits |
| Mobile | Correct national number format | Missing `0`, invalid prefix, too short, letters, Persian-digit format when ASCII-only is required |
| Postal code | Ten-digit, rule-compliant format | Too short, non-digits, disallowed prefix (where rules are available) |
| Name | Synthetic Persian name | Empty, only whitespace, too long, unexpected invisible character |
| Date | Schema-conforming date | Impossible day, leap-year boundary, unsupported format |

The generator should make test failures **deterministic** when a seed is provided and should label why a generated value is expected to be accepted or rejected.

## Proposed API (not yet implemented)

```ts
import { persianMock } from "persian-mock-data";

const validUser = persianMock.generate({
  fullName: { type: "person.fullName" },
  mobile: { type: "phone.mobile" },
  nationalId: { type: "identity.nationalId" },
  postalCode: { type: "address.postalCode" },
}, {
  mode: "valid",
  seed: 1405,
});

const invalidNationalId = persianMock.field("identity.nationalId", {
  mode: "invalid",
  scenario: "wrong-checksum",
  seed: 1405,
});
```

The final API will be designed and tested during implementation. No npm package is claimed to have been published yet.

## National ID validation contract

The **reference implementation is the validator supplied by the project owner**. Its behavior is the initial compatibility target:

- Input: a string containing **exactly 10 ASCII digits** (`0`–`9`).
- Rejects these repeated-digit values explicitly: `0000000000`, `2222222222`, `3333333333`, `4444444444`, `5555555555`, `6666666666`, `7777777777`, `8888888888`, and `9999999999`.
- Weights the first nine digits from `10` down to `2`; computes `remainder = weightedSum % 11`.
- The final digit must equal `remainder` if it is below `2`, or `11 - remainder` otherwise.

```ts
// Equivalent in behavior to the user-supplied function, with scoped variables.
export function validateNationalId(value: string): boolean {
  const repeated = new Set([
    "0000000000", "2222222222", "3333333333", "4444444444",
    "5555555555", "6666666666", "7777777777", "8888888888",
    "9999999999",
  ]);

  if (!/^[0-9]{10}$/.test(value) || repeated.has(value)) return false;

  const digits = [...value].map(Number);
  const sum = digits.slice(0, 9).reduce((total, digit, i) =>
    total + digit * (10 - i), 0);
  const remainder = sum % 11;
  const checkDigit = digits[9];
  return remainder < 2
    ? checkDigit === remainder
    : checkDigit === 11 - remainder;
}
```

> **Known edge case to decide:** The supplied reference does **not** explicitly reject `1111111111`, and that value passes its checksum calculation. We should preserve reference behavior initially, add a regression test documenting it, and decide whether to offer a separate `strict` policy that rejects all repeated-digit sequences. Do not silently alter the reference rule.

## Design principles

- **Framework-agnostic core** written in TypeScript, suitable for React, Next.js, Vue, Angular, and vanilla JS.
- **Explicit validation policies:** configure expected input formats and choose which rules a fixture should violate.
- **Reproducible fixtures:** optional seeded generation for stable automated tests.
- **Coherent data:** province/city/landline area-code relationships should agree where supported by maintained reference data.
- **Extensible schemas:** allow custom fields, generators, validators, and cross-field constraints.
- **Safe by design:** clearly synthetic fixtures; avoid promising real-world existence, deliverability, or unique assignment.
- **Developer-friendly:** typed API, useful error messages, unit tests, documentation, and small imports.

## Roadmap

- [ ] **v0.1 — Core:** project setup, seeded random engine, basic Persian names, phones, national ID validation and generation, and unit tests.
- [ ] **v0.2 — Negative testing:** invalid-case catalog, named scenarios, boundary conditions, metadata describing failed rules.
- [ ] **v0.3 — Iranian location data:** province/city/address relationships, landline area codes, postal-code rules with documented limitations.
- [ ] **v0.4 — Schema-aware generation:** field mappings, custom generators, JSON Schema / Zod integrations.
- [ ] **v0.5 — Form ecosystem:** adapters and examples for React Hook Form and Formik.
- [ ] **v1.0 — Stable library:** documented API, compatibility tests, CI, versioned releases, and npm publication.
- [ ] **Future:** opt-in browser/devtools autofill for supported forms; accessibility and mixed-direction input test presets.

## Contributing

Contributions, bug reports, and reproducible Iranian form edge cases are welcome once the repository setup is complete. Please add tests for any new validation rule or invalid scenario and document the source and limitations of format constraints.

## License

A permissive open-source license such as **MIT** is proposed; add a `LICENSE` file before release.
