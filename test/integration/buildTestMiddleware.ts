import { KintResponse } from "../../src";
import {
  Middleware,
  MiddlewareHandler,
} from "../../src/core/models/Middleware";

// eslint-disable-next-line jsdoc/require-jsdoc
export function buildTestMiddleware<Name extends string, Context, Config>(
  name: Name,
  before: (config: Config) => Context | null = () => null,
  after: (res: KintResponse) => KintResponse = (res) => res,
): Middleware<Name, Context | null, Config> {
  const middlewareHandler: MiddlewareHandler<Context | null, Config> = (
    request,
    next,
    config,
  ): KintResponse => {
    const context = before(config);
    const result = next(context);
    return after(result);
  };

  return {
    name,
    handler: middlewareHandler,
  };
}
