import { MaybeAsync } from "../../../utils/types/MaybeAsync";
import { ConfigurableHandler } from "../../models/ConfigurableHandler";
import { DuvetRequest } from "../../models/DuvetRequest";
import { DuvetResponse } from "../../models/DuvetResponse";
import { Middleware } from "../../models/Middleware";
import { HandlerBuilder } from "./HandlerBuilder";

/**
 * The middleware handler builder is a handler builder that wraps the inner handler with a middleware.
 */
export class MiddlewareHandlerBuilder<
  MiddlewareName extends string,
  GlobalContext, // Represents the base context which is passed into the outer handler
  InnerHandlerContext extends { global: GlobalContext }, // Represents the full context which is passed to the inner handler from the previous wrapper.
  ContextExtension,
  InnerHandlerConfig extends object,
  ConfigExtension,
> implements
    HandlerBuilder<
      { global: GlobalContext },
      InnerHandlerContext & Record<MiddlewareName, ContextExtension>,
      InnerHandlerConfig & Record<MiddlewareName, ConfigExtension>
    >
{
  private innerHandlerBuilder: HandlerBuilder<
    { global: GlobalContext },
    InnerHandlerContext,
    InnerHandlerConfig
  >;

  /**
   * The middleware which is used to wrap the outer handler.
   */
  private middleware: Middleware<
    MiddlewareName,
    ConfigExtension,
    ContextExtension,
    GlobalContext
  >;

  constructor(
    innerHandlerBuilder: HandlerBuilder<
      { global: GlobalContext },
      InnerHandlerContext,
      InnerHandlerConfig
    >,
    middleware: Middleware<
      MiddlewareName,
      ConfigExtension,
      ContextExtension,
      GlobalContext
    >,
  ) {
    this.innerHandlerBuilder = innerHandlerBuilder;
    this.middleware = middleware;
  }

  /**
   * This function is used to extend the context with the middleware's context extension.
   * @param context The context to extend.
   * @param key The key to extend the context with.
   * @param ext The extension to add to the context.
   * @returns The context with the extension added.
   */
  private extendContext<InputContext extends object>(
    context: { global: GlobalContext } & InputContext,
    key: MiddlewareName,
    ext: ContextExtension,
  ): { global: GlobalContext } & InputContext &
    Record<MiddlewareName, ContextExtension> {
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    (context as Record<MiddlewareName, ContextExtension>)[key] = ext;
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    return context as { global: GlobalContext } & Record<
      MiddlewareName,
      ContextExtension
    > &
      InputContext;
  }

  private createNextFunction<
    InputContext extends object,
    InputConfig extends object,
  >(
    request: DuvetRequest,
    inputContext: { global: GlobalContext } & InputContext,
    config: InputConfig &
      InnerHandlerConfig &
      Record<MiddlewareName, ConfigExtension>,
    innerHandler: ConfigurableHandler<
      InputContext &
        InnerHandlerContext &
        Record<MiddlewareName, ContextExtension>,
      InputConfig & InnerHandlerConfig & Record<MiddlewareName, ConfigExtension>
    >,
  ): (valueToExtendContextWith: ContextExtension) => MaybeAsync<DuvetResponse> {
    const wrappedInnerHandler = this.innerHandlerBuilder.buildWrappedHandler<
      InputContext & Record<MiddlewareName, ContextExtension>,
      InputConfig & Record<MiddlewareName, ConfigExtension>
    >(innerHandler);

    return async (context: ContextExtension) => {
      const extendedContext = this.extendContext<InputContext>(
        inputContext,
        this.middleware.name,
        context,
      );

      return await wrappedInnerHandler(request, extendedContext, config);
    };
  }

  /**
   * This is a generic function which takes a handler and returns a new handler which wraps the input handler with the middleware.
   * @param innerHandler The handler that this builder will wrap with middleware.
   * @returns A new handler which passes the inner handler into it.
   */
  buildWrappedHandler<InputContext extends object, InputConfig extends object>(
    innerHandler: ConfigurableHandler<
      { global: GlobalContext } & InnerHandlerContext &
        InputContext &
        Record<MiddlewareName, ContextExtension>,
      InnerHandlerConfig & InputConfig & Record<MiddlewareName, ConfigExtension>
    >,
  ): ConfigurableHandler<
    { global: GlobalContext } & InputContext,
    InnerHandlerConfig & InputConfig & Record<MiddlewareName, ConfigExtension>
  > {
    const newHandler: ConfigurableHandler<
      { global: GlobalContext } & InputContext,
      InnerHandlerConfig & InputConfig & Record<MiddlewareName, ConfigExtension>
    > = async (request, inputContext, config) => {
      const next = this.createNextFunction<InputContext, InputConfig>(
        request,
        inputContext,
        config,
        innerHandler,
      );

      return await this.middleware.handler(
        {
          config: config[this.middleware.name],
          global: inputContext.global,
          request,
        },
        next,
      );
    };

    return newHandler;
  }
}
