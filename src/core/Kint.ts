import { KintRequest } from './models/KintRequest';
import { KintResponse } from './models/KintResponse';
import { Middleware } from './models/middleware/Middleware';
import { PostProcessingMiddleware } from './models/middleware/PostProcessingMiddleware';
import { PostProcessingMiddlewareTuple } from './models/middleware/PostProcessingMiddlewareTuple';
import { PreprocessingMiddleware } from './models/middleware/PreprocessingMiddleware';
import { PreprocessingMiddlewareTuple } from './models/middleware/PreprocessingMiddlewareTuple';
import { PostProcessorCatchTypes } from './models/middleware/utils/PostProcessorCatchTypes';
import { PreProcessorsMutationType } from './models/middleware/utils/PreProcessorMutationType';
import { mergeConfigs } from '../utils/mergeConfigs';
import { AppendTuple } from '../utils/types/AppendTuple';
import { MaybePromise } from '../utils/types/MaybePromise';
import { ZodEndpointConfig } from '../zod-ext/models/ZodEndpointConfig';
import { ZodRawShapePrimitives } from '../zod-ext/models/ZodRawShapePrimitives';
import { ZodSchemaDefinition } from '../zod-ext/models/ZodSchemaDefinition';
import { zodPreprocessor } from '../zod-ext/zodPreprocessor';
import { Endpoint } from './models/Endpoint';

export type HandlerInput<PreProcessors extends PreprocessingMiddlewareTuple> =
	PreProcessorsMutationType<PreProcessors> & KintRequest;

export type HandlerOutput<
	PostProcessors extends PostProcessingMiddlewareTuple
> = MaybePromise<PostProcessorCatchTypes<PostProcessors> | KintResponse>;

export class Kint<
	Context,
	Config extends object,
	PreProcessors extends PreprocessingMiddlewareTuple,
	PostProcessors extends PostProcessingMiddlewareTuple
> {
	private defaultConfig: Config;
	private preProcessors: PreProcessors;
	private postProcessors: PostProcessors;

	constructor(
		userConfig: Config,
		preProcessors: PreProcessors,
		postProcessors: PostProcessors
	) {
		this.defaultConfig = userConfig;
		this.preProcessors = preProcessors;
		this.postProcessors = postProcessors;
	}

	middleware<
		MWConfig,
		NewCatch extends object,
		HandlerInputExtension extends object
	>(
		middleware: Middleware<MWConfig, HandlerInputExtension, NewCatch>
	): Kint<
		Context,
		Config & MWConfig,
		AppendTuple<
			PreProcessors,
			PreprocessingMiddleware<MWConfig, HandlerInputExtension>
		>,
		AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
	> {
		return new Kint<
			Context,
			Config & MWConfig,
			AppendTuple<
				PreProcessors,
				PreprocessingMiddleware<MWConfig, HandlerInputExtension>
			>,
			AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
		>(
			mergeConfigs(this.defaultConfig, middleware.defaultConfig),
			[...this.preProcessors, middleware],
			[...this.postProcessors, middleware]
		);
	}

	postprocessingMiddleware<MWConfig, NewCatch extends object>(
		middleware: PostProcessingMiddleware<MWConfig, NewCatch>
	): Kint<
		Context,
		Config & MWConfig,
		PreProcessors,
		AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
	> {
		return new Kint<
			Context,
			Config & MWConfig,
			PreProcessors,
			AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
		>(
			mergeConfigs(this.defaultConfig, middleware.defaultConfig),
			this.preProcessors,
			[...this.postProcessors, middleware]
		);
	}

	preprocessingMiddleware<MWConfig, HandlerInputExtension extends object>(
		middleware: PreprocessingMiddleware<MWConfig, HandlerInputExtension>
	): Kint<
		Context,
		Config & MWConfig,
		AppendTuple<
			PreProcessors,
			PreprocessingMiddleware<MWConfig, HandlerInputExtension>
		>,
		PostProcessors
	> {
		return new Kint<
			Context,
			Config & MWConfig,
			AppendTuple<
				PreProcessors,
				PreprocessingMiddleware<MWConfig, HandlerInputExtension>
			>,
			PostProcessors
		>(
			mergeConfigs(this.defaultConfig, middleware.defaultConfig),
			[...this.preProcessors, middleware],
			this.postProcessors
		);
	}

	extendConfig(config: Partial<Config>) {
		return new Kint<Context, Config, PreProcessors, PostProcessors>(
			mergeConfigs(this.defaultConfig, config),
			this.preProcessors,
			this.postProcessors
		);
	}

	setConfig(newConfig: ((config: Config) => Config) | Config) {
		if (typeof newConfig === 'function') {
			return new Kint<Context, Config, PreProcessors, PostProcessors>(
				newConfig(this.defaultConfig),
				this.preProcessors,
				this.postProcessors
			);
		} else {
			return new Kint<Context, Config, PreProcessors, PostProcessors>(
				newConfig,
				this.preProcessors,
				this.postProcessors
			);
		}
	}

	/**
	 * This function is used to define a new endpoint in the Kint instance.
	 * @param config
	 * @param handler
	 * @returns
	 */
	defineEndpoint(
		config: Config,
		handler: (
			handlerInput: HandlerInput<PreProcessors>,
			context: Context,
			config: Config
		) => HandlerOutput<PostProcessors>
	): Endpoint<Context, Config, PreProcessors, PostProcessors> {
		return {
			preProcessors: this.preProcessors,
			postProcessors: this.postProcessors,
			config: mergeConfigs(this.defaultConfig, config),
			handler,
		};
	}

	// ============================= ZOD EXTENSION =============================

	defineZodEndpoint<
		Body extends ZodSchemaDefinition,
		UrlParams extends ZodRawShapePrimitives,
		QueryParams extends ZodRawShapePrimitives
	>(
		config: Config & ZodEndpointConfig<Body, UrlParams, QueryParams>,
		handler: (
			request: HandlerInput<
				AppendTuple<
					PreProcessors,
					ReturnType<typeof zodPreprocessor<Body, UrlParams, QueryParams>>
				>
			>,
			context: Context,
			config: Config
		) => HandlerOutput<PostProcessors>
	) {
		const newKint = this.preprocessingMiddleware(
			zodPreprocessor<Body, UrlParams, QueryParams>()
		);

		return newKint.defineEndpoint(config, handler);
	}
}
