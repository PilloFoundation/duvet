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
export type ValidatorArray = readonly [...Validator<string, any>[]];

export type ValidatedData<Validators extends ValidatorArray> = {
  [Validator in Validators[number] as ExtractField<Validator>]: ExtractData<Validator>;
};

export type ExtractField<V> = V extends Validator<infer Field, unknown>
  ? Field
  : never;

export type ExtractData<V> = V extends Validator<string, infer Data>
  ? Data
  : never;

// const makeV: <Field extends string, Data>(
//   field: Field,
//   data: Data
// ) => Validator<Field, Data> = (field, data) => {
//   return {
//     validate: () => {
//       return {
//         isValid: true,
//         field,
//         parsedData: data,
//       };
//     },
//   };
// };

// const test = [
//   makeV("test", 5),
//   makeV("another", { some: "data" }),
//   makeV("third", "string"),
// ];

// type Test = ValidatedData<typeof test>;

// const x: Test = {
//   another: { some: "data" },
// };
