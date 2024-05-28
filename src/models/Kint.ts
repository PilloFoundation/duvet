import { Middleware } from '../middleware/models/Middleware';
import { PostProcessingMiddleware } from '../middleware/models/PostProcessingMiddleware';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PreprocessingMiddleware } from '../middleware/models/PreprocessingMiddleware';
import { PreprocessingMiddlewareTuple } from '../middleware/models/PreprocessingMiddlewareTuple';
import { PostProcessorCatchTypes } from '../middleware/utils/PostProcessorCatchTypes';
import { PreProcessorsMutationType } from '../middleware/utils/PreProcessorMutationType';
import { mergeConfigs } from '../utils/mergeConfigs';
import { AppendTuple } from '../utils/types/AppendTuple';
import { MaybePromise } from '../utils/types/MaybePromise';
import { Endpoint } from './Endpoint';
import { KintRequest } from './KintRequest';
import { KintResponse } from './KintResponse';

export type HandlerInput<PreProcessors extends PreprocessingMiddlewareTuple> =
	PreProcessorsMutationType<PreProcessors> & KintRequest;

export type HandlerOutput<
	PostProcessors extends PostProcessingMiddlewareTuple
> = MaybePromise<PostProcessorCatchTypes<PostProcessors> | KintResponse>;

export class Kint<
	Context,
	Config,
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

	/**
	 * This function is used to define a new endpoint in the Kint instance.
	 * @param config
	 * @param handler
	 * @returns
	 */
	defineEndpoint(
		config: Partial<Config>,
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

	defineZodEndpoint(
		config: Partial<Config>,
		handler: (
			request: HandlerInput<PreProcessors>,
			context: Context,
			config: Config
		) => HandlerOutput<PostProcessors>
	) {}
}
