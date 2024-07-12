/**
 *
 * @param fnOrValue The function or value to get the value from.
 * @param old The old value which the update function can use
 * @returns The new value from the function or the value itself.
 */
export function getFromFnOrValue<Old, New extends object>(
  fnOrValue: ((config: Old) => New) | New,
  old: Old,
): New {
  if (typeof fnOrValue === "function") {
    return fnOrValue(old);
  } else {
    return fnOrValue;
  }
}
