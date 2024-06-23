import { ConfigurableHandler } from "../../models/ConfigurableHandler";
import { HandlerBuilder } from "./HandlerBuilder";

type EmptyObject = {};

/**
 * The base handler builder is a handler builder that does not wrap the inner handler with any additional functionality. It simply passes it through.
 */
export class BaseHandlerBuilder<Config extends object>
  implements HandlerBuilder<EmptyObject, EmptyObject, Config>
{
  buildWrappedHandler<InputContext extends object, InputConfig extends object>(
    innerHandler: ConfigurableHandler<InputContext, InputConfig & Config>,
  ): ConfigurableHandler<InputContext, Config & InputConfig> {
    return innerHandler;
  }
}
