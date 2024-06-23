import { GenericValidatorMapArray } from "../validation/GenericValidatorMapArray";
import { MergeValidatorMaps } from "../validation/MergeValidatorMaps";

export function mergeValidators<
  RequestType,
  Validators extends GenericValidatorMapArray<RequestType>,
>(validators: Validators): MergeValidatorMaps<RequestType, Validators> {
  return validators.reduce<MergeValidatorMaps<RequestType, Validators>>(
    (accumulator, validatorMap) => {
      return {
        ...accumulator,
        ...validatorMap,
      };
    },
    {} as MergeValidatorMaps<RequestType, Validators>,
  );
}
