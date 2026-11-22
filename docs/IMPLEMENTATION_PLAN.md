# Implementation plan

The package is implemented in small, testable phases. Every phase is kept in a
cohesive conventional commit and is verified with type-checking, unit tests,
and a production build before it is committed.

## Phase 1: package foundation

- Configure a strict, framework-agnostic TypeScript package.
- Produce ESM, CommonJS, and declaration-file outputs.
- Add a deterministic seeded pseudo-random generator.
- Add the test runner, package metadata, and MIT license.

## Phase 2: valid Iranian data

- Add Persian person names.
- Add Iranian mobile and landline numbers with an explicit supported-prefix
  policy.
- Add format-level postal codes.
- Implement the project owner's exact Iranian national-ID Mod-11 contract.
- Test format rules, checksum rules, and deterministic output.

## Phase 3: negative testing and schema API

- Add named invalid and edge-case scenarios for every supported field.
- Return metadata explaining the intentionally violated rule.
- Implement single-field and schema-based generation through `persianMock`.
- Test stable seeded output and every named scenario.

## Phase 4: documentation

- Document installation, imports, public APIs, scenarios, and limitations.
- Include examples for both valid and deliberately invalid test data.
- Clearly distinguish format-valid mock data from real or officially assigned
  identity, contact, and address data.
