import { KintRequest } from "./KintRequest";
import { KintResponse } from "./KintResponse";

export type MaybeFunction<T> = void extends T
  ? () => KintResponse
  : undefined extends T
    ? (ext?: T | undefined) => KintResponse
    : (ext: T) => KintResponse;

export type MiddlewareHandler<
  ConfigExtension,
  ContextExtension,
  GlobalContext = unknown,
> = (
  request: KintRequest,
  next: MaybeFunction<ContextExtension>,
  config: ConfigExtension,
  globalContext: GlobalContext,
) => KintResponse;

export type Middleware<
  Name extends string,
  ConfigExtension = void,
  ContextExtension = void,
  GlobalContext = unknown,
> = {
  handler: MiddlewareHandler<ConfigExtension, ContextExtension, GlobalContext>;
  name: Name;
};
