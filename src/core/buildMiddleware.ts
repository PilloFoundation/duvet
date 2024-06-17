import { Middleware } from "./models/Middleware";

// TODO: Add more information about the parameters and add a reference to the middleware object.
/**
 * Builds a middleware object.
 * @param name The name of the middleware.
 * @param handler The handler that wraps the middleware.
 * @returns A middleware object.
 */
export function buildMiddleware<
  Name extends string,
  Config = void,
  Context = void,
  GlobalContext = void,
>(
  name: Name,
  handler: Middleware<Name, Config, Context, GlobalContext>["handler"],
): Middleware<Name, Config, Context, GlobalContext> {
  return {
    name,
    handler,
  };
}
