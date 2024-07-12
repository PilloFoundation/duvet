import { RequireMissingOnDefault } from "./types/RequireMissingOnDefault";

/**
 * Creates an object with the `Output` type by merging two objects: a `defaults` object and an `overrides` object. The function takes the
 * `overrides` object and fills in the missing fields with those from the `default` object. If a field is present in both the `defaults` and
 * `overrides` object, the field on the `overrides` object will override the respective field on the default object. If a field is not present
 * in the defaults object which is required on the output object, then it will also be required on the `overrides` object.
 * @param defaults A default object which which may have some fields from the Output type.
 * @param overrides An object which fills in the fields which do not have `defaults`, and optionally `overrides` the fields which do have defaults.
 * @returns A merged object with type of `Output`.
 */
export function mergeDefaultWithMissingItems<Output, Default = Partial<Output>>(
  defaults: Default,
  overrides: RequireMissingOnDefault<Output, Default>,
): Output {
  return {
    ...defaults,
    ...overrides,
  } as Output;
}
