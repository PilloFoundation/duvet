import { Handler } from "./models/Handler";
import {
  DefineEndpointFunctionArgs,
  WithValid,
} from "./models/DefineEndpointFunction";
import { ValidatorArray } from "./models/Validator";

export function extractParts<
  Context,
  Config,
  DefaultConfig,
  Validators extends ValidatorArray
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
