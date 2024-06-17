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
): Middleware<Name, Config, Context | null> {
  const middlewareHandler: MiddlewareHandler<Config, Context | null> = (
    request,
    next,
    config,
  ): KintResponse => {
    const contextExt = before(config);
    const result = next(contextExt);
    return after(result);
  };

  return {
    name,
    handler: middlewareHandler,
  };
}
