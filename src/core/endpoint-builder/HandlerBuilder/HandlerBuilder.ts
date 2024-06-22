import { ConfigurableHandler } from "../../models/ConfigurableHandler";

/**
 * A handler builder is anything which takes in inner handler and wraps it with some additional functionality.
 */
export interface HandlerBuilder<
  BaseContext extends object,
  AddedContext extends BaseContext,
  Config extends object,
> {
  buildWrappedHandler<InputContext extends object, InputConfig extends object>(
    innerHandler: ConfigurableHandler<
      InputContext & AddedContext & BaseContext,
      InputConfig & Config
    >,
  ): ConfigurableHandler<InputContext & BaseContext, InputConfig & Config>;
}
