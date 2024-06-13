import { Middleware } from "./models/Middleware";

export function buildMiddleware<
  Name extends string,
  Context = void,
  Config = void
>(
  name: Name,
  handler: Middleware<Name, Context, Config>["handler"]
): Middleware<Name, Context, Config> {
  return {
    name,
    handler,
  };
}
