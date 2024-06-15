import { ConfigurableHandler } from "./ConfigurableHandler";

export type HandlerBuilder<Context, Config> = {
  buildConfigurableHandler: <
    FullContext extends Context,
    FullConfig extends Config,
  >(
    /**
     * The handler that this builder will wrap with middleware.
     */
    innerHandler: ConfigurableHandler<Context, Config>,
  ) => ConfigurableHandler<FullContext, FullConfig>;
};
