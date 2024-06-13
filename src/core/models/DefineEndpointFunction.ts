import { KintExport } from "./KintExport";
import { RequireMissingOnDefault } from "../../utils/requireFromDefault";
import { KintEndpointMeta } from "./KintEndpointMeta";
import { Handler } from "./Handler";
import { ValidatedData, ValidatorArray } from "./Validator";

export type WithValid<Context, Validators extends ValidatorArray> = Context & {
  valid: ValidatedData<Validators>;
};

export type DefineEndpointFunctionArgs<
  Context,
  Config,
  DefaultConfig,
  Validators extends ValidatorArray
> = readonly [
  config: RequireMissingOnDefault<Config, DefaultConfig>,
  ...validators: Validators,
  handler: Handler<WithValid<Context, Validators>, Config>
];

export type DefineEndpointFunction<Context, Config, DefaultConfig> = <
  Validators extends ValidatorArray
>(
  ...args: DefineEndpointFunctionArgs<
    Context,
    Config,
    DefaultConfig,
    Validators
  >
) => KintExport<KintEndpointMeta>;
