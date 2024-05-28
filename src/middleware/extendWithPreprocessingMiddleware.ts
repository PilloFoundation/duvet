import { Kint } from '../models/Kint/Kint';
import { ExtractPostProcessors } from '../models/Kint/ExtractPostProcessors';
import { ExtractHandlerInput } from '../models/Kint/ExtractHandlerInput';
import { ExtractConfig } from '../models/Kint/ExtractConfig';
import { ExtractContext } from '../models/Kint/ExtractContext';
import { PostProcessingMiddlewareTuple } from './models/PostProcessingMiddlewareTuple';
import { RawKintRequest } from '../models/RawKintRequest';
import { PreprocessingMiddleware } from './models/PreprocessingMiddleware';
import { mergeConfigs } from '../utils/mergeConfigs';

export function extendWithPreprocessingMiddleware<
	MWConfig,
	NewHandlerInput extends RawKintRequest,
	OldKint extends Kint<any, any, any, any>
>(
	kint: OldKint,
	middleware: PreprocessingMiddleware<
		MWConfig,
		NewHandlerInput,
		ExtractHandlerInput<OldKint>
	>
): Kint<
	ExtractContext<OldKint>,
	ExtractConfig<OldKint> & MWConfig,
	NewHandlerInput,
	ExtractPostProcessors<OldKint>
> {
	return {
		postProcessors: kint.postProcessors,
		userConfig: mergeConfigs(kint.userConfig, middleware.defaultConfig),
		preProcessor: {
			preProcess: (
				request: RawKintRequest,
				config: MWConfig & ExtractConfig<OldKint>
			) => {
				const processedRequest = kint.preProcessor.preProcess(request, config);
				return middleware.preProcess(processedRequest, config);
			},
		},
	};
}
