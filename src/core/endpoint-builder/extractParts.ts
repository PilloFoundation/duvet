import { ConfigurableHandler } from "../models/ConfigurableHandler";
import {
  DefineEndpointFunctionArgs,
  WithValid,
} from "../models/DefineEndpointFunction";
import { FlattenValidatorArray, ValidatorArray } from "../models/Validator";

/**
 * Takes an args array from the define endpoint function and extracts the config, validators, and handler from it in a type safe way.
 * @param args The args array to extract the parts from.
 * @returns An object containing the config, validators, and handler.
 */
export function extractParts<
  GlobalContext,
  Config,
  DefaultConfig,
  Validators extends ValidatorArray,
>(
  ...args: DefineEndpointFunctionArgs<
    GlobalContext,
    Config,
    DefaultConfig,
    Validators
  >
): {
  config: Config;
  validators: Validators;
  handler: ConfigurableHandler<
    WithValid<{ global: GlobalContext }, FlattenValidatorArray<Validators>>,
    Config
  >;
} {
  return {
    config: args[0] as Config,
    validators: args.slice(1, -1) as unknown as Validators,
    handler: args[args.length - 1] as ConfigurableHandler<
      WithValid<{ global: GlobalContext }, FlattenValidatorArray<Validators>>,
      Config
    >,
  };
}
