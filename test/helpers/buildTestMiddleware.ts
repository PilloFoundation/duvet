import { DuvetResponse } from "../../src";
import {
  Middleware,
  MiddlewareHandler,
} from "../../src/core/models/Middleware";
import { MaybeAsync } from "../../src/utils/types/MaybeAsync";

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
  after: (response: DuvetResponse) => MaybeAsync<DuvetResponse> = (response) =>
    response,
): Middleware<Name, Config, Context | null, GlobalContext> {
  const middlewareHandler: MiddlewareHandler<
    Config,
    Context | null,
    GlobalContext
  > = async ({ config, global }, next): Promise<DuvetResponse> => {
    const contextExt = await before(config, global);
    const result = await next(contextExt);
    return await after(result);
  };

  return {
    name,
    handler: middlewareHandler,
  };
}
