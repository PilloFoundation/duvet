import { KintRequest } from "./models/KintRequest";
import { KintResponse } from "./models/KintResponse";
import { PostProcessingMiddleware } from "./models/middleware/PostProcessingMiddleware";
import { PostProcessingMiddlewareTuple } from "./models/middleware/PostProcessingMiddlewareTuple";
import { PreProcessingMiddlewareTuple } from "./models/middleware/PreProcessingMiddlewareTuple";
import { PreProcessingMiddleware } from "./models/middleware/PreProcessingMiddleware";
import { PostProcessorCatchTypes } from "./models/middleware/utils/PostProcessorCatchTypes";
import { PreProcessorsExtensionType } from "./models/middleware/utils/PreProcessorMutationType";
import { mergeDefaultWithMissingItems } from "../utils/mergeConfigs";
import { extendObject } from "../utils/extendConfig";
import { AppendTuple } from "../utils/types/AppendTuple";
import { MaybePromise } from "../utils/types/MaybePromise";
import { ZodEndpointConfig } from "../zod-ext/models/ZodEndpointConfig";
import { ZodRawShapePrimitives } from "../zod-ext/models/ZodRawShapePrimitives";
import { ZodSchemaDefinition } from "../zod-ext/models/ZodSchemaDefinition";
import { zodPreprocessor } from "../zod-ext/zodPreprocessor";
import { Endpoint } from "./models/Endpoint";
import { RequireMissingOnDefault } from "../utils/requireFromDefault";

export type HandlerInput<PreProcessors extends PreProcessingMiddlewareTuple> =
  PreProcessorsExtensionType<PreProcessors> & KintRequest;

export type HandlerOutput<
  PostProcessors extends PostProcessingMiddlewareTuple
> = MaybePromise<PostProcessorCatchTypes<PostProcessors> | KintResponse>;

export class Kint<
  Context,
  Config extends object,
  DefaultConfig extends Partial<Config>,
  PreProcessors extends PreProcessingMiddlewareTuple,
  PostProcessors extends PostProcessingMiddlewareTuple
> {
  private defaultConfig: DefaultConfig;
  private preProcessors: PreProcessors;
  private postProcessors: PostProcessors;

  constructor(
    defaultConfig: DefaultConfig,
    preProcessors: PreProcessors,
    postProcessors: PostProcessors
  ) {
    this.defaultConfig = defaultConfig;
    this.preProcessors = preProcessors;
    this.postProcessors = postProcessors;
  }

  /**
   * This function is used to define a new postprocessing middleware. PostProcessing middleware can be
   * used to catch objects thrown or returned by the endpoint handler.
   *
   * @param middleware A PostProcessingMiddleware object that defines the middleware.
   * @returns A new Kint instance with the new middleware added.
   */
  postprocessingMiddleware<MWConfig, NewCatch extends object>(
    middleware: PostProcessingMiddleware<MWConfig, NewCatch>
  ): Kint<
    Context,
    Config & MWConfig,
    DefaultConfig & {},
    PreProcessors,
    AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
  > {
    return new Kint<
      Context,
      Config & MWConfig,
      DefaultConfig & {},
      PreProcessors,
      AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
    >(this.defaultConfig, this.preProcessors, [
      ...this.postProcessors,
      middleware,
    ]);
  }

  /**
   * This function is used to define a new preprocessing middleware. Middleware can be used to modify the input object
   * before it reaches the endpoint handler or to return a response immediately to the user.
   *
   * @param middleware A PreProcessingMiddleware object that defines the middleware.
   * @returns A new Kint instance with the new middleware added.
   */
  preprocessingMiddleware<
    MWConfig extends object,
    HandlerInputExtension extends object
  >(
    middleware: PreProcessingMiddleware<MWConfig, HandlerInputExtension>
  ): Kint<
    Context,
    Config & MWConfig,
    DefaultConfig & {},
    AppendTuple<
      PreProcessors,
      PreProcessingMiddleware<MWConfig, HandlerInputExtension>
    >,
    PostProcessors
  > {
    return new Kint<
      Context,
      Config & MWConfig,
      DefaultConfig & {},
      AppendTuple<
        PreProcessors,
        PreProcessingMiddleware<MWConfig, HandlerInputExtension>
      >,
      PostProcessors
    >(
      this.defaultConfig,
      [...this.preProcessors, middleware],
      this.postProcessors
    );
  }

  /**
   * Extends the default config object. Takes a partial object to extend the default config object with.
   *
   * @param extension A partial object to extend the default config object with.
   * @returns A new Kint instance with the new default config object.
   */
  extendConfig<DefaultConfigExtension extends Partial<Config>>(
    extension: DefaultConfigExtension
  ) {
    return new Kint<
      Context,
      Config,
      DefaultConfig & DefaultConfigExtension,
      PreProcessors,
      PostProcessors
    >(
      extendObject(this.defaultConfig, extension),
      this.preProcessors,
      this.postProcessors
    );
  }

  /**
   * Overrides the config object with a new one. This can be a partial object or a function that takes the current config object and returns a new one.
   *
   * @param newConfig A new config object or a function that takes the current config object and returns a new one.
   * @returns A new Kint instance with the new config object.
   */
  setConfig<NewDefaultConfig extends Partial<Config>>(
    newConfig: ((config: DefaultConfig) => NewDefaultConfig) | NewDefaultConfig
  ) {
    if (typeof newConfig === "function") {
      return new Kint<
        Context,
        Config,
        NewDefaultConfig,
        PreProcessors,
        PostProcessors
      >(newConfig(this.defaultConfig), this.preProcessors, this.postProcessors);
    } else {
      return new Kint<
        Context,
        Config,
        NewDefaultConfig,
        PreProcessors,
        PostProcessors
      >(newConfig, this.preProcessors, this.postProcessors);
    }
  }

  /**
   * This function is used to define a new endpoint.
   *
   * @param config A configuration object to configure any middleware.
   * @param handler A handler function that will be called when this endpoint is hit.
   * @returns And endpoint definition which can be used by Kint to build a router.
   */
  defineEndpoint(
    config: RequireMissingOnDefault<Config, DefaultConfig>,
    handler: (
      handlerInput: HandlerInput<PreProcessors>,
      context: Context,
      config: Config
    ) => HandlerOutput<PostProcessors>
  ): Endpoint<Context, Config, PreProcessors, PostProcessors> {
    return {
      builtByKint: true,
      preProcessors: this.preProcessors,
      postProcessors: this.postProcessors,
      config: mergeDefaultWithMissingItems(this.defaultConfig, config),
      handler,
    };
  }

  // ============================= ZOD EXTENSION ============================= //

  /** Defines a zod endpoints which automatically validates your body, url parameters and query parameters. This simply wraps the `defineEndpoint` function */
  defineZodEndpoint<
    Body extends ZodSchemaDefinition,
    UrlParams extends ZodRawShapePrimitives,
    QueryParams extends ZodRawShapePrimitives
  >(
    config: RequireMissingOnDefault<
      Config & ZodEndpointConfig<Body, UrlParams, QueryParams>,
      DefaultConfig & {}
    >,
    handler: (
      request: HandlerInput<
        AppendTuple<
          PreProcessors,
          ReturnType<typeof zodPreprocessor<Body, UrlParams, QueryParams>>
        >
      >,
      context: Context,
      config: Config & ZodEndpointConfig<Body, UrlParams, QueryParams>
    ) => HandlerOutput<PostProcessors>
  ) {
    const newKint = this.preprocessingMiddleware(
      zodPreprocessor<Body, UrlParams, QueryParams>()
    );

    return newKint.defineEndpoint(config, handler);
  }
}
