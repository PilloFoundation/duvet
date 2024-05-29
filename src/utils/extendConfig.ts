export function extendObject<OldObject, PartialObjectUpdate>(
  oldObject: OldObject,
  update: PartialObjectUpdate
): OldObject & PartialObjectUpdate {
  return { ...oldObject, ...update };
}
