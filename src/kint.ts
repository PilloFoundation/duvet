type Handler<Request, Response, Context, Config> = {};

export type RawKintRequest = {};
export type RawKintResponse = {};

export type PreprocessingMiddleware<
	Config,
	OutputRequest,
	InputRequest = RawKintRequest
> = {
	preProcess: (request: InputRequest, config: Config) => OutputRequest;
};

export type StrictPreprocessingMiddleware<
	Config,
	OutputRequest extends RawKintRequest,
	InputRequest = RawKintRequest
> = PreprocessingMiddleware<Config, OutputRequest, InputRequest>;

export type PostProcessingMiddleware<Config, CatchType> = {
	matcher: (thrown: any) => thrown is CatchType;
	catcher: (
		thrown: CatchType,
		request: RawKintRequest,
		config: Config
	) => RawKintResponse;
};

export type PostProcessingMiddlewareTuple = PostProcessingMiddleware<
	any,
	any
>[];

export type Kint<
	Context,
	Config,
	HandlerInput,
	PostProcessors extends PostProcessingMiddlewareTuple
> = {
	defaultConfig: Config;
	preProcessor: PreprocessingMiddleware<Config, HandlerInput>;
	postProcessors: PostProcessors;
};

function extendWithPreprocessingMiddleware<
	Context,
	ExistingConfig,
	MWConfig,
	OldInput,
	NewInput,
	PostProcessors extends PostProcessingMiddlewareTuple
>(
	kint: Kint<Context, ExistingConfig & MWConfig, OldInput, PostProcessors>,
	middleware: PreprocessingMiddleware<MWConfig, NewInput, OldInput>
) {
	return {
		...kint,
		preProcess: (
			request: RawKintRequest,
			config: ExistingConfig & MWConfig
		) => {
			const processedRequest = kint.preProcessor.preProcess(request, config);
			return middleware.preProcess(processedRequest, config);
		},
	};
}

type PostProcessorCatchTypes<
	ConcretePostProcessingMiddlewareTuple extends PostProcessingMiddlewareTuple
> =
	ConcretePostProcessingMiddlewareTuple[number] extends PostProcessingMiddleware<
		any,
		infer CatchType
	>
		? CatchType
		: never;

type AppendTuple<T extends any[], E> = [...T, E];

function extendWithPostprocessingMiddleware<
	Context,
	ExistingConfig,
	MWConfig,
	InputType,
	PostProcessors extends PostProcessingMiddlewareTuple,
	NewCatch
>(
	kint: Kint<Context, ExistingConfig & MWConfig, InputType, PostProcessors>,
	middleware: PostProcessingMiddleware<MWConfig, NewCatch>
): Kint<
	Context,
	ExistingConfig & MWConfig,
	InputType,
	AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
> {
	const newKint: Kint<
		Context,
		ExistingConfig & MWConfig,
		InputType,
		AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
	> = {
		defaultConfig: kint.defaultConfig,
		preProcessor: kint.preProcessor,
		postProcessors: [...kint.postProcessors, middleware],
	};

	return newKint;
}

function mergeConfigs<Config>(
	defaultConfig: Config,
	userConfig: Partial<Config>
): Config {
	// TODO: MERGE CONFIGS
	return defaultConfig;
}

function processOutput<
	PostProcessors extends PostProcessingMiddlewareTuple,
	Config
>(
	postProcessors: PostProcessors,
	rawKintRequest: RawKintRequest,
	config: Config,
	response: any
): RawKintResponse {
	for (const postProcessor of postProcessors) {
		if (postProcessor.matcher(response)) {
			return postProcessor.catcher(response, rawKintRequest, config);
		}
	}
	return {};
}

function defineEndpoint<
	Context,
	Config,
	HandlerInput,
	PostProcessors extends PostProcessingMiddlewareTuple
>(
	kint: Kint<Context, Config, HandlerInput, PostProcessors>,
	userConfig: Config,
	handler: (
		handlerInput: HandlerInput,
		context: Context,
		userConfig: Config
	) => PostProcessorCatchTypes<PostProcessors>
) {
	return (rawKintRequest: RawKintRequest, context: Context) => {
		const config = mergeConfigs(kint.defaultConfig, userConfig);
		const handlerInput = kint.preProcessor.preProcess(rawKintRequest, config);

		try {
			throw handler(handlerInput, context, config);
		} catch (thrown) {
			return processOutput(kint.postProcessors, rawKintRequest, config, thrown);
		}
	};
}
