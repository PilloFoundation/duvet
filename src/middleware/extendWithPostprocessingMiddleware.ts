import { AppendTuple } from '../utils/AppendTuple';
import { Kint } from '../models/Kint';
import { PostProcessingMiddlewareTuple } from './models/PostProcessingMiddlewareTuple';
import { PostProcessingMiddleware } from './models/PostProcessingMiddleware';

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
