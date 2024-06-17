import { KintRequest } from "./KintRequest";

export type Validator<Field extends string, Data> = {
  validate: (request: KintRequest) => ValidationResult<Field, Data>;
};

export type ValidationFailure = {
  isValid: false;
  error: string;
};

export type ValidationResult<Field extends string, Data> =
  | ValidationSuccess<Field, Data>
  | ValidationFailure;

export type ValidationSuccess<Field extends string, Data> = {
  isValid: true;
  field: Field;
  parsedData: Data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorArrayFlat = readonly [...Validator<string, any>[]];

export type ValidatorArray = readonly [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(Validator<string, any> | ValidatorArrayFlat)[],
];

export function isValidatorArrayFlat(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: Validator<string, any> | ValidatorArrayFlat,
): validator is ValidatorArrayFlat {
  return Array.isArray(validator);
}

type FlattenValidatorArray<T extends ValidatorArray> =
  T extends readonly (infer U)[]
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      U extends Validator<string, any>
      ? readonly U[]
      : U extends ValidatorArray
        ? readonly [...FlattenValidatorArray<U>]
        : never
    : never;

export type ValidatedData<Validators extends ValidatorArray> = {
  [Validator in FlattenValidatorArray<Validators>[number] as ExtractField<Validator>]: ExtractData<Validator>;
};

export type ExtractField<V> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V extends Validator<infer Field, any> ? Field : never;

export type ExtractData<V> =
  V extends Validator<string, infer Data> ? Data : never;
