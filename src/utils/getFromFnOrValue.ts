export function getFromFnOrValue<Old, New extends object>(
  fnOrValue: ((config: Old) => New) | New,
  old: Old
): New {
  if (typeof fnOrValue === "function") {
    return fnOrValue(old);
  } else {
    return fnOrValue;
  }
}
