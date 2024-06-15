import { KintExport } from "./KintExport";
import { RequireMissingOnDefault } from "../../utils/types/RequireMissingOnDefault";
import { KintEndpoint } from "./KintEndpoint";
import { ConfigurableHandler } from "./ConfigurableHandler";
import { ValidatedData, ValidatorArray } from "./Validator";

export type WithValid<Context, Validators extends ValidatorArray> = Context & {
  valid: ValidatedData<Validators>;
};

export type DefineEndpointFunctionArgs<
  Context,
  Config,
  DefaultConfig,
  Validators extends ValidatorArray,
> = readonly [
  config: RequireMissingOnDefault<Config, DefaultConfig>,
  ...validators: Validators,
  handler: ConfigurableHandler<WithValid<Context, Validators>, Config>,
];

export type DefineEndpointFunction<Context, Config, DefaultConfig> = <
  Validators extends ValidatorArray,
>(
  ...args: DefineEndpointFunctionArgs<
    Context,
    Config,
    DefaultConfig,
    Validators
  >
) => KintExport<KintEndpoint>;
