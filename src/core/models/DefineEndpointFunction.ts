import { KintExport } from "./KintExport";
import { RequireMissingOnDefault } from "../../utils/types/RequireMissingOnDefault";
import { KintEndpoint } from "./KintEndpoint";
import { ConfigurableHandler } from "./ConfigurableHandler";
import { ValidatedData, ValidatorArray } from "./Validator";

export type WithValid<Context, Validators extends ValidatorArray> = Context & {
  valid: ValidatedData<Validators>;
};

export type DefineEndpointFunctionArgs<
  GlobalContext,
  Config,
  DefaultConfig,
  Validators extends ValidatorArray,
> = readonly [
  config: RequireMissingOnDefault<Config, DefaultConfig>,
  ...validators: Validators,
  handler: ConfigurableHandler<
    WithValid<{ global: GlobalContext }, Validators>,
    Config
  >,
];

export type DefineEndpointFunction<GlobalContext, Config, DefaultConfig> = <
  Validators extends ValidatorArray,
>(
  ...args: DefineEndpointFunctionArgs<
    GlobalContext,
    Config,
    DefaultConfig,
    Validators
  >
) => KintExport<KintEndpoint<GlobalContext, Config>>;
