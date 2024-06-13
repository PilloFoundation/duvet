import { KintRequest } from "./KintRequest";
import { KintResponse } from "./KintResponse";

export type MaybeFunction<T> = void extends T
  ? () => KintResponse
  : undefined extends T
  ? (ext?: T) => KintResponse
  : (ext: T) => KintResponse;

export type MiddlewareHandler<ContextExtension, ConfigExtension> =
  void extends ConfigExtension
    ? (
        request: KintRequest,
        next: MaybeFunction<ContextExtension>
      ) => KintResponse
    : (
        request: KintRequest,
        next: MaybeFunction<ContextExtension>,
        config: ConfigExtension
      ) => KintResponse;

export type Middleware<
  Name extends string,
  ContextExtension = void,
  ConfigExtension = void
> = {
  handler: MiddlewareHandler<ContextExtension, ConfigExtension>;
  name: Name;
};
