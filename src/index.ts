export { createRandom, resolveRandom } from "./core/random";
export type { Random, RandomSource, Seed } from "./core/random";

export { PERSIAN_FIRST_NAMES, PERSIAN_LAST_NAMES } from "./data/person";
export { LANDLINE_AREAS, MOBILE_PREFIXES } from "./data/phone";
export type { LandlineArea } from "./data/phone";

export {
  generateFirstName,
  generateFullName,
  generateLastName,
} from "./generators/person";
export { generateLandline, generateMobile } from "./generators/phone";
export type { GeneratedLandline } from "./generators/phone";
export { generatePostalCode } from "./generators/postal-code";
export {
  calculateNationalIdCheckDigit,
  generateNationalId,
} from "./generators/national-id";

export { validateLandline, validateMobile } from "./validators/phone";
export { validatePostalCode } from "./validators/postal-code";
export {
  FORBIDDEN_REPEATED_NATIONAL_IDS,
  validateNationalId,
} from "./validators/national-id";
export { validatePersianName } from "./validators/person";

export { INVALID_SCENARIOS, VIOLATED_RULES } from "./scenarios";
export type { InvalidScenario } from "./scenarios";
export { persianMock } from "./persian-mock";
export type {
  AnyFieldDefinition,
  FieldDefinition,
  FieldOptions,
  FieldType,
  GenerateOptions,
  GeneratedSchema,
  GenerationMode,
  MockCase,
  MockSchema,
} from "./types";
