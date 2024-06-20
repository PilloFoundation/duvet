import { DuvetResponse } from "../../src";
import {
  Middleware,
  MiddlewareHandler,
} from "../../src/core/models/Middleware";

// eslint-disable-next-line jsdoc/require-jsdoc
export function buildTestMiddleware<
  Name extends string,
  Context,
  Config,
  GlobalContext = unknown,
>(
  name: Name,
  before: (
    config: Config,
    globalContext: GlobalContext,
  ) => Context | null = () => null,
  after: (response: DuvetResponse) => DuvetResponse = (response) => response,
): Middleware<Name, Config, Context | null, GlobalContext> {
  const middlewareHandler: MiddlewareHandler<
    Config,
    Context | null,
    GlobalContext
  > = (request, next, config, globalContext): DuvetResponse => {
    const contextExt = before(config, globalContext);
    const result = next(contextExt);
    return after(result);
  };

  return {
    name,
    handler: middlewareHandler,
  };
}
