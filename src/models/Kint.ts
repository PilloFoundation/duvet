import { extendWithPreprocessingMiddleware } from '../middleware/extendWithPreprocessingMiddleware';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PreprocessingMiddleware } from '../middleware/models/PreprocessingMiddleware';

export type Kint<
	Context,
	Config,
	HandlerInput,
	PostProcessors extends PostProcessingMiddlewareTuple
> = {
	userConfig: Config;
	preProcessor: Pick<
		PreprocessingMiddleware<Config, HandlerInput>,
		'preProcess'
	>;
	postProcessors: PostProcessors;
};
