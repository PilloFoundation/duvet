import { AppendTuple } from '../utils/types/AppendTuple';
import { Kint } from '../models/Kint';
import { PostProcessingMiddlewareTuple } from './models/PostProcessingMiddlewareTuple';
import { PostProcessingMiddleware } from './models/PostProcessingMiddleware';
import { mergeConfigs } from '../utils/mergeConfigs';

function extendWithPostprocessingMiddleware<
	Context,
	ExistingConfig,
	MWConfig,
	InputType,
	PostProcessors extends PostProcessingMiddlewareTuple,
	NewCatch
>(
	kint: Kint<Context, ExistingConfig, InputType, PostProcessors>,
	middleware: PostProcessingMiddleware<MWConfig, NewCatch>
): Kint<
	Context,
	ExistingConfig & MWConfig,
	InputType,
	AppendTuple<PostProcessors, PostProcessingMiddleware<MWConfig, NewCatch>>
> {
	return {
		userConfig: mergeConfigs(kint.userConfig, middleware.defaultConfig),
		preProcessor: kint.preProcessor,
		postProcessors: [...kint.postProcessors, middleware],
	};
}
