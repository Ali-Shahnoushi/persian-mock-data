import type { Seed } from "./core/random";
import type { InvalidScenario } from "./scenarios";

export type FieldType =
  | "person.firstName"
  | "person.lastName"
  | "person.fullName"
  | "phone.mobile"
  | "phone.landline"
  | "identity.nationalId"
  | "address.postalCode";

export type GenerationMode = "valid" | "invalid";

export type FieldOptions<T extends FieldType> =
  | { mode?: "valid"; seed?: Seed }
  | { mode: "invalid"; scenario?: InvalidScenario<T>; seed?: Seed };

export interface FieldDefinition<T extends FieldType = FieldType> {
  type: T;
  mode?: GenerationMode;
  scenario?: InvalidScenario<T>;
}

export type AnyFieldDefinition = {
  [T in FieldType]: FieldDefinition<T>;
}[FieldType];

export type MockSchema = Record<string, AnyFieldDefinition>;

export interface GenerateOptions {
  mode?: GenerationMode;
  seed?: Seed;
}

export interface MockCase<T extends FieldType = FieldType> {
  type: T;
  value: string;
  expectedValid: boolean;
  scenario?: InvalidScenario<T>;
  violatedRule?: string;
}

export type GeneratedSchema<T extends MockSchema> = {
  [K in keyof T]: string;
};
