import { Handler } from "./models/Handler";
import {
  DefineEndpointFunctionArgs,
  WithValid,
} from "./models/DefineEndpointFunction";
import { ValidatorArray } from "./models/Validator";

/**
 * Takes an args array from the define endpoint function and extracts the config, validators, and handler from it in a type safe way.
 * @param args The args array to extract the parts from.
 * @returns An object containing the config, validators, and handler.
 */
export function extractParts<
  Context,
  Config,
  DefaultConfig,
  Validators extends ValidatorArray,
>(
  ...args: DefineEndpointFunctionArgs<
    Context,
    Config,
    DefaultConfig,
    Validators
  >
): {
  config: Config;
  validators: Validators;
  handler: Handler<WithValid<Context, Validators>, Config>;
} {
  return {
    config: args[0] as Config,
    validators: args.slice(1, -1) as unknown as Validators,
    handler: args[args.length - 1] as Handler<
      WithValid<Context, Validators>,
      Config
    >,
  };
}
