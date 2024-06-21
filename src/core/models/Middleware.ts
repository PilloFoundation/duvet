import { DuvetRequest } from "./DuvetRequest";
import { DuvetResponse } from "./DuvetResponse";

export type MaybeFunction<T> = void extends T
  ? () => DuvetResponse
  : undefined extends T
    ? (ext?: T | undefined) => DuvetResponse
    : (ext: T) => DuvetResponse;

export type MiddlewareHandler<
  ConfigExtension,
  ContextExtension,
  GlobalContext = unknown,
> = (
  request: DuvetRequest,
  next: MaybeFunction<ContextExtension>,
  config: ConfigExtension,
  globalContext: GlobalContext,
) => DuvetResponse;

export type Middleware<
  Name extends string,
  ConfigExtension = void,
  ContextExtension = void,
  GlobalContext = unknown,
> = {
  handler: MiddlewareHandler<ConfigExtension, ContextExtension, GlobalContext>;
  name: Name;
};
