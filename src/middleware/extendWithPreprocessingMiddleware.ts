import { Kint } from '../models/Kint';
import { PostProcessingMiddlewareTuple } from './models/PostProcessingMiddlewareTuple';
import { RawKintRequest } from '../models/RawKintRequest';
import { PreprocessingMiddleware } from './models/PreprocessingMiddleware';

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
