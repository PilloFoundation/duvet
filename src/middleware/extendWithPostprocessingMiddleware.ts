import { AppendTuple } from '../utils/types/AppendTuple';
import { Kint } from '../models/Kint/Kint';
import { ExtractPostProcessors } from '../models/Kint/ExtractPostProcessors';
import { ExtractHandlerInput } from '../models/Kint/ExtractHandlerInput';
import { ExtractConfig } from '../models/Kint/ExtractConfig';
import { ExtractContext } from '../models/Kint/ExtractContext';
import { PostProcessingMiddlewareTuple } from './models/PostProcessingMiddlewareTuple';
import { PostProcessingMiddleware } from './models/PostProcessingMiddleware';
import { mergeConfigs } from '../utils/mergeConfigs';

export function extendWithPostprocessingMiddleware<
	MWConfig,
	NewCatch,
	OldKint extends Kint<any, any, any, any>
>(
	kint: OldKint,
	middleware: PostProcessingMiddleware<MWConfig, NewCatch>
): Kint<
	ExtractContext<OldKint>,
	ExtractConfig<OldKint> & MWConfig,
	ExtractHandlerInput<OldKint>,
	AppendTuple<
		ExtractPostProcessors<OldKint>,
		PostProcessingMiddleware<MWConfig, NewCatch>
	>
> {
	return {
		userConfig: mergeConfigs(kint.userConfig, middleware.defaultConfig),
		preProcessor: kint.preProcessor,
		postProcessors: [
			...(kint.postProcessors as ExtractPostProcessors<OldKint>),
			middleware,
		],
	};
}
