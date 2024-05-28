import { PostProcessingMiddleware } from '../../middleware/models/PostProcessingMiddleware';
import { PostProcessingMiddlewareTuple } from '../../middleware/models/PostProcessingMiddlewareTuple';
import { PreprocessingMiddleware } from '../../middleware/models/PreprocessingMiddleware';
import { PostProcessorCatchTypes } from '../../middleware/utils/PostProcessorCatchTypes';
import { mergeConfigs } from '../../utils/mergeConfigs';
import { AppendTuple } from '../../utils/types/AppendTuple';
import { MaybePromise } from '../../utils/types/MaybePromise';
import { Endpoint } from '../Endpoint';
import { RawKintRequest } from '../RawKintRequest';

export class Kint<
	Context,
	Config,
	HandlerInput extends RawKintRequest,
	PostProcessors extends PostProcessingMiddlewareTuple
> {
	userConfig: Config;
	preProcessor: Pick<
		PreprocessingMiddleware<Config, HandlerInput>,
		'preProcess'
	>;
	postProcessors: PostProcessors;

	constructor(
		userConfig: Config,
		preProcessor: Pick<
			PreprocessingMiddleware<Config, HandlerInput>,
			'preProcess'
		>,
		postProcessors: PostProcessors
	) {
		this.userConfig = userConfig;
		this.preProcessor = preProcessor;
		this.postProcessors = postProcessors;
	}

	postprocessingMiddleware<MWConfig, NewCatch>(
		middleware: PostProcessingMiddleware<MWConfig, NewCatch>
	): Kint<
		Context,
		Config & MWConfig,
		HandlerInput,
		AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
	> {
		return new Kint<
			Context,
			Config & MWConfig,
			HandlerInput,
			AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
		>(
			mergeConfigs(this.userConfig, middleware.defaultConfig),
			this.preProcessor,
			[...this.postProcessors, middleware]
		);
	}

	preprocessingMiddleware<MWConfig, NewHandlerInput extends RawKintRequest>(
		middleware: PreprocessingMiddleware<MWConfig, NewHandlerInput, HandlerInput>
	): Kint<Context, Config & MWConfig, NewHandlerInput, PostProcessors> {
		return new Kint<
			Context,
			Config & MWConfig,
			NewHandlerInput,
			PostProcessors
		>(
			mergeConfigs(this.userConfig, middleware.defaultConfig),
			{
				preProcess: (request: RawKintRequest, config: MWConfig & Config) => {
					const processedRequest = this.preProcessor.preProcess(
						request,
						config
					);
					return middleware.preProcess(processedRequest, config);
				},
			},
			this.postProcessors
		);
	}

	defineEndpoint(
		config: Config,
		handler: (
			request: HandlerInput,
			context: Context,
			config: Config
		) => MaybePromise<PostProcessorCatchTypes<PostProcessors>>
	): Endpoint<Context, Config, HandlerInput, PostProcessors> {
		return {
			kint: this,
			config,
			handler,
		};
	}
}
