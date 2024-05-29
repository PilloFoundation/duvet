import { KintRequest } from "./models/KintRequest";
import { KintResponse } from "./models/KintResponse";
import { PostProcessingMiddleware } from "./models/middleware/PostProcessingMiddleware";
import { PostProcessingMiddlewareTuple } from "./models/middleware/PostProcessingMiddlewareTuple";
import { PreprocessingMiddleware } from "./models/middleware/PreprocessingMiddleware";
import { PreprocessingMiddlewareTuple } from "./models/middleware/PreprocessingMiddlewareTuple";
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

export type HandlerInput<PreProcessors extends PreprocessingMiddlewareTuple> =
  PreProcessorsExtensionType<PreProcessors> & KintRequest;

export type HandlerOutput<
  PostProcessors extends PostProcessingMiddlewareTuple
> = MaybePromise<PostProcessorCatchTypes<PostProcessors> | KintResponse>;

export class Kint<
  Context,
  Config extends object,
  DefaultConfig extends Partial<Config>,
  PreProcessors extends PreprocessingMiddlewareTuple,
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

  preprocessingMiddleware<
    MWConfig extends object,
    HandlerInputExtension extends object
  >(
    middleware: PreprocessingMiddleware<MWConfig, HandlerInputExtension>
  ): Kint<
    Context,
    Config & MWConfig,
    DefaultConfig & {},
    AppendTuple<
      PreProcessors,
      PreprocessingMiddleware<MWConfig, HandlerInputExtension>
    >,
    PostProcessors
  > {
    return new Kint<
      Context,
      Config & MWConfig,
      DefaultConfig & {},
      AppendTuple<
        PreProcessors,
        PreprocessingMiddleware<MWConfig, HandlerInputExtension>
      >,
      PostProcessors
    >(
      this.defaultConfig,
      [...this.preProcessors, middleware],
      this.postProcessors
    );
  }

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
   * This function is used to define a new endpoint in the Kint instance.
   * @param config
   * @param handler
   * @returns
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

  // ============================= ZOD EXTENSION =============================

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
