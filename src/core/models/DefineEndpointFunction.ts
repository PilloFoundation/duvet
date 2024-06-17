import { RequireMissingOnDefault } from "../../utils/types/RequireMissingOnDefault";
import { ConfigurableHandler } from "./ConfigurableHandler";
import {
  ValidatedData,
  ValidatorArray,
  FlatValidatorArray,
  FlattenValidatorArray,
} from "./Validator";

export type WithValid<
  Context,
  Validators extends FlatValidatorArray,
> = Context & {
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
    WithValid<{ global: GlobalContext }, FlattenValidatorArray<Validators>>,
    Config
  >,
];
