import { mergeDefaultWithMissingItems } from "../../utils/mergeDefaultWithMissingItems";
import { extendObject } from "../../utils/extendObject";
import { DuvetExport } from "../models/DuvetExport";
import { Middleware } from "../models/Middleware";
import { getFromFnOrValue } from "../../utils/getFromFnOrValue";
import { DuvetEndpoint } from "../models/DuvetEndpoint";
import { NotKeyOf } from "../../utils/types/NotKeyOf";
import { DefineEndpointFunctionArgs } from "../models/DefineEndpointFunction";
import { ValidatorArray } from "../models/Validator";
import { extractParts } from "./extractParts";
import { wrapHandlerWithValidationLayer } from "./handlerWithValidators";
import { HandlerBuilder } from "./handler-builder/HandlerBuilder";
import { MiddlewareHandlerBuilder } from "./handler-builder/MiddlewareHandlerBuilder";
import { BaseHandlerBuilder } from "./handler-builder/BaseHandlerBuilder";

// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyObject = {};

/**
 * The main class that is used to define endpoints and build a router
 */
export class DuvetEndpointBuilder<
  Context extends PreviousContext,
  Config extends object,
  DefaultConfig,
  GlobalContext,
  PreviousContext extends { global: GlobalContext },
> {
  /**
   * Creates a new DuvetEndpointBuilder object. This is the starting point for defining endpoints.
   * @returns A new DuvetEndpointBuilder instance with a global context object.
   */
  public static new<GlobalContext>() {
    type Context = {
      global: GlobalContext;
    };

    return new DuvetEndpointBuilder<
      Context,
      EmptyObject,
      EmptyObject,
      GlobalContext,
      { global: GlobalContext }
    >({}, new BaseHandlerBuilder());
  }

  private defaultConfig: DefaultConfig;

  /**
   * Builds a new handler with all the previous middleware applied to it.
   */
  private handlerBuilder: HandlerBuilder<
    { global: GlobalContext },
    PreviousContext,
    Config
  >;

  private constructor(
    defaultConfig: DefaultConfig,
    handlerBuilder: HandlerBuilder<
      { global: GlobalContext },
      PreviousContext,
      Config
    >,
  ) {
    this.defaultConfig = defaultConfig;
    this.handlerBuilder = handlerBuilder;
  }

  /**
   * Extends the default config object. Takes a partial object to extend the default config object with.
   * @param extension A partial object to extend the default config object with.
   * @returns A new DuvetEndpointBuilder instance with the new default config object.
   */
  extendConfig<DefaultConfigExtension extends Partial<Config>>(
    extension: DefaultConfigExtension,
  ) {
    return new DuvetEndpointBuilder<
      Context,
      Config,
      DefaultConfig & DefaultConfigExtension,
      GlobalContext,
      PreviousContext
    >(extendObject(this.defaultConfig, extension), this.handlerBuilder);
  }

  /**
   * Creates a new DuvetEndpointBuilder with the middleware added.
   * @param middleware The middleware to extend the DuvetEndpointBuilder instance with
   * @returns A new DuvetEndpointBuilder instance with the middleware added.
   */
  addMiddleware<Name extends string, ContextExt, ConfigExt>(
    middleware: Middleware<
      NotKeyOf<Name, Config>,
      ConfigExt,
      ContextExt,
      GlobalContext
    >,
  ) {
    const newHandlerBuilder = new MiddlewareHandlerBuilder<
      NotKeyOf<Name, Config>,
      GlobalContext,
      Context,
      ContextExt,
      Config,
      ConfigExt
    >(this.handlerBuilder, middleware);

    // Creates a new DuvetEndpointBuilder object with the new handler builder.
    return new DuvetEndpointBuilder<
      Context & Record<Name, ContextExt>,
      Config & Record<Name, ConfigExt>,
      DefaultConfig,
      GlobalContext,
      Context
    >(this.defaultConfig, newHandlerBuilder);
  }

  /**
   * Overrides the config object with a new one. This can be a partial object or a function that takes the current config object and returns a new one.
   * @param newConfig A new config object or a function that takes the current config object and returns a new one.
   * @returns A new DuvetEndpointBuilder instance with the new config object.
   */
  setConfig<NewDefaultConfig extends Partial<Config>>(
    newConfig: ((config: DefaultConfig) => NewDefaultConfig) | NewDefaultConfig,
  ) {
    const resolvedNewConfig = getFromFnOrValue(newConfig, this.defaultConfig);

    return new DuvetEndpointBuilder<
      Context,
      Config,
      NewDefaultConfig,
      GlobalContext,
      PreviousContext
    >(resolvedNewConfig, this.handlerBuilder);
  }

  defineEndpoint<Validators extends ValidatorArray>(
    ...args: DefineEndpointFunctionArgs<
      Context,
      GlobalContext,
      Config,
      DefaultConfig,
      Validators
    >
  ): DuvetExport<DuvetEndpoint<GlobalContext, Config>> {
    const { config, validators, handler } = extractParts<
      Context,
      GlobalContext,
      Config,
      DefaultConfig,
      Validators
    >(...args);

    // Merges the config from the user with the default config.
    const mergedConfig = mergeDefaultWithMissingItems<Config, DefaultConfig>(
      this.defaultConfig,
      config,
    );

    const flattenedValidators = validators.flatMap((validator) => validator);

    const handlerWithMiddleware = this.handlerBuilder.buildWrappedHandler(
      wrapHandlerWithValidationLayer(handler, flattenedValidators),
    );

    return {
      builtByDuvet: true,
      data: {
        config: mergedConfig,
        handler: (request, context) =>
          handlerWithMiddleware(request, context, mergedConfig),
        exportType: "DuvetEndpoint",
      },
    };
  }
}
