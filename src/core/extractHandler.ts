import { Handler } from "./models/Handler";
import { Validator } from "./models/Validator";
import { WithValid } from "./models/WithValid";
import { createValidatingHandler } from "./createValidatingHandler";

export function extractHandler<Context, Config, Body, Params>(
  param:
    | [
        Validator<Body, Params>,
        Handler<WithValid<Context, Body, Params>, Config>
      ]
    | [Handler<Context, Config>]
) {
  if (param.length === 1) {
    return param[0];
  } else {
    const [validator, handler] = param;
    return createValidatingHandler(handler, validator);
  }
}
