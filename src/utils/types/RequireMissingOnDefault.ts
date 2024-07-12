export type RequiredKeysWithNoKeyOnDefault<T, D> = Exclude<
  keyof RemoveOptionals<T>,
  keyof RemoveOptionals<D>
>;

/**
 * Removes all optional fields from `T`, including those that can be set to `undefined`.
 */
type RemoveOptionals<T> = {
  [K in keyof T as OptionalOrUndefined<T, K>]: T[K];
};

/**
 * Returns the keys of `T` that are required and do not exist on `D`.
 */
type OptionalOrUndefined<T, K extends keyof T> =
  Record<string | number | symbol, never> extends Pick<T, K>
    ? never
    : undefined extends T[K]
      ? never
      : K;

/**
 * Creates a new type from the input type where all the fields that are required on the input type but do
 * not exist on the default type are required.
 *
 * For each field on `T`, the field on the output type will be
 * | T          | D                | Output     |
 * | ---------- | ---------------- | ---------- |
 * | `optional` | `exists`         | `optional` |
 * | `optional` | `does not exist` | `optional` |
 * | `required` | `exists`         | `optional` |
 * | `required` | `does not exist` | `required` |
 */
export type RequireMissingOnDefault<T, D> = {
  [K in RequiredKeysWithNoKeyOnDefault<T, D>]: T[K];
} & Partial<T>;

// ======================================== TESTING ========================================

/**
 * The following code only exists to test that the above type functions work as expected.
 */

type Output = {
  requiredOnOutputAndOnDefault: string;
  requiredOnOutputButOptionalOnDefault: string;
  requiredOnOutputButCanBeUndefinedOnDefault: string;
  requiredOnOutputButMissingOnDefault: string;

  optionalOnOutputAndOnDefault?: string;
  optionalOnOutputButOptionalOnDefault?: string;
  optionalOnOutputButCanBeUndefinedOnDefault?: string;
  optionalOnOutputButMissingOnDefault?: string;

  canBeUndefinedOnOutputAndOnDefault: string | undefined;
  canBeUndefinedOnOutputButOptionalOnDefault: string | undefined;
  canBeUndefinedOnOutputButCanBeUndefinedOnDefault: string | undefined;
  canBeUndefinedOnOutputButMissingOnDefault: string | undefined;
};

type Defaults = {
  requiredOnOutputAndOnDefault: string;
  requiredOnOutputButOptionalOnDefault?: string;
  requiredOnOutputButCanBeUndefinedOnDefault: string | undefined;

  optionalOnOutputAndOnDefault: string;
  optionalOnOutputButOptionalOnDefault?: string;
  optionalOnOutputButCanBeUndefinedOnDefault: string | undefined;

  canBeUndefinedOnOutputAndOnDefault: string;
  canBeUndefinedOnOutputButOptionalOnDefault?: string;
  canBeUndefinedOnOutputButCanBeUndefinedOnDefault: string | undefined;
};

type RequiredKeysTest = RequiredKeysWithNoKeyOnDefault<Output, Defaults>;
type NonRequiredKeysTest = Exclude<keyof Output, RequiredKeysTest>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requiredKeysTest: RequiredKeysTest[] = [
  "requiredOnOutputButMissingOnDefault",
  "requiredOnOutputButCanBeUndefinedOnDefault",
  "requiredOnOutputButOptionalOnDefault",
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nonRequiredKeysTest: NonRequiredKeysTest[] = [
  "optionalOnOutputAndOnDefault",
  "optionalOnOutputButOptionalOnDefault",
  "optionalOnOutputButCanBeUndefinedOnDefault",
  "optionalOnOutputButMissingOnDefault",
  "canBeUndefinedOnOutputAndOnDefault",
  "canBeUndefinedOnOutputButOptionalOnDefault",
  "canBeUndefinedOnOutputButCanBeUndefinedOnDefault",
  "canBeUndefinedOnOutputButMissingOnDefault",
];
