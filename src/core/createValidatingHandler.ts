import { KintRequest } from "./models/KintRequest";
import { Handler } from "./models/Handler";
import { Validator } from "./models/Validator";
import { WithValid } from "./models/WithValid";

export function createValidatingHandler<Context, Config, Body, Params>(
  handler: Handler<WithValid<Context, Body, Params>, Config>,
  validator: Validator<Body, Params>
): Handler<Context, Config> {
  return (request: KintRequest, context: Context, config: Config) => {
    const validationResult = validator(request);

    if (validationResult.isValid) {
      const contextWithParsedData = context as WithValid<Context, Body, Params>;

      contextWithParsedData.valid = validationResult.parsedData;

      return handler(request, contextWithParsedData, config);
    } else {
      throw new Error(validationResult.error);
    }
  };
}
