import { PostProcessingMiddleware } from '../../middleware/models/PostProcessingMiddleware';
import { PostProcessingMiddlewareTuple } from '../../middleware/models/PostProcessingMiddlewareTuple';
import { PreprocessingMiddleware } from '../../middleware/models/PreprocessingMiddleware';
import { PreprocessingMiddlewareTuple } from '../../middleware/models/PreprocessingMiddlewareTuple';
import { PostProcessorCatchTypes } from '../../middleware/utils/PostProcessorCatchTypes';
import { PreProcessorMutationType } from '../../middleware/utils/PreProcessorMutationType';
import { mergeConfigs } from '../../utils/mergeConfigs';
import { AppendTuple } from '../../utils/types/AppendTuple';
import { MaybePromise } from '../../utils/types/MaybePromise';
import { Endpoint } from '../Endpoint';
import { KintRequest } from '../KintRequest';

export class Kint<
	Context,
	Config,
	PreProcessors extends PreprocessingMiddlewareTuple,
	PostProcessors extends PostProcessingMiddlewareTuple
> {
	userConfig: Config;
	preProcessors: PreProcessors;
	postProcessors: PostProcessors;

	constructor(
		userConfig: Config,
		preProcessors: PreProcessors,
		postProcessors: PostProcessors
	) {
		this.userConfig = userConfig;
		this.preProcessors = preProcessors;
		this.postProcessors = postProcessors;
	}

	postprocessingMiddleware<MWConfig, NewCatch>(
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
			mergeConfigs(this.userConfig, middleware.defaultConfig),
			this.preProcessors,
			[...this.postProcessors, middleware]
		);
	}

	preprocessingMiddleware<MWConfig, HandlerInputExtension>(
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
			mergeConfigs(this.userConfig, middleware.defaultConfig),
			[...this.preProcessors, middleware],
			this.postProcessors
		);
	}

	defineEndpoint(
		config: Config,
		handler: (
			request: PreProcessorMutationType<PreProcessors> & KintRequest,
			context: Context,
			config: Config
		) => MaybePromise<PostProcessorCatchTypes<PostProcessors>>
	): Endpoint<Context, Config, PreProcessors, PostProcessors> {
		return {
			kint: this,
			config,
			handler,
		};
	}
}
