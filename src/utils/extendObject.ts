/**
 * Extends an object with another object. The function takes an object and extends it with another object.
 * If a field is present in both the `oldObject` and `update` object, the field on the `update` object will
 * override the respective field on the `oldObject`.
 *
 * __TODO:__ Make this function work with nested objects. It should do a deep merge, not override the entire object. Perhaps a field should allow developers to select deep mode
 * @param base The object to extend.
 * @param update The object to extend the `oldObject` with.
 * @returns A new object with the fields from both the `oldObject` and `update` object.
 */
export function extendObject<Base, Extension>(
  base: Base,
  update: Extension,
): Base & Extension {
  return { ...base, ...update };
}
