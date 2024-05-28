import { Kint } from '../models/Kint';
import { PostProcessingMiddlewareTuple } from './models/PostProcessingMiddlewareTuple';
import { RawKintRequest } from '../models/RawKintRequest';
import { PreprocessingMiddleware } from './models/PreprocessingMiddleware';
import { mergeConfigs } from '../utils/mergeConfigs';

function extendWithPreprocessingMiddleware<
	Context,
	ExistingConfig,
	MWConfig,
	OldInput,
	NewInput,
	PostProcessors extends PostProcessingMiddlewareTuple
>(
	kint: Kint<Context, ExistingConfig, OldInput, PostProcessors>,
	middleware: PreprocessingMiddleware<MWConfig, NewInput, OldInput>
): Kint<Context, ExistingConfig & MWConfig, NewInput, PostProcessors> {
	return {
		postProcessors: kint.postProcessors,
		userConfig: mergeConfigs(kint.userConfig, middleware.defaultConfig),
		preProcessor: {
			preProcess: (
				request: RawKintRequest,
				config: MWConfig & ExistingConfig
			) => {
				const processedRequest = kint.preProcessor.preProcess(request, config);
				return middleware.preProcess(processedRequest, config);
			},
		},
	};
}
