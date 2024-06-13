import { Handler } from "./Handler";

export type HandlerBuilder<Context, Config> = {
  buildHandler: <FullContext extends Context, FullConfig extends Config>(
    /**
     * The handler that this builder will wrap with middleware.
     */
    innerHandler: Handler<Context, Config>
  ) => Handler<FullContext, FullConfig>;
};
