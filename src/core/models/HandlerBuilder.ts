import { ConfigurableHandler } from "./ConfigurableHandler";

export type HandlerBuilder<
  GlobalContext,
  PreviousContext extends { global: GlobalContext },
  PreviousConfig,
> = {
  buildConfigurableHandler: <
    NewContext extends PreviousContext,
    NewConfig extends PreviousConfig,
  >(
    /**
     * The handler that this builder will wrap with middleware.
     */
    innerHandler: ConfigurableHandler<NewContext, NewConfig>,
  ) => ConfigurableHandler<{ global: GlobalContext }, NewConfig>;
};
