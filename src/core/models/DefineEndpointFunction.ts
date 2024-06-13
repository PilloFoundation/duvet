import { KintExport } from "./KintExport";
import { RequireMissingOnDefault } from "../../utils/requireFromDefault";
import { KintEndpointMeta } from "./KintEndpointMeta";
import { Handler } from "./Handler";
import { WithValid } from "./WithValid";
import { Validator } from "./Validator";

export type DefineEndpointFunction<Context, Config, DefaultConfig> = <
  Body,
  Params
>(
  config: RequireMissingOnDefault<Config, DefaultConfig>,
  ...rest:
    | [
        Validator<Body, Params>,
        Handler<WithValid<Context, Body, Params>, Config>
      ]
    | [Handler<Context, Config>]
) => KintExport<KintEndpointMeta>;
