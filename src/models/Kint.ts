import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PreprocessingMiddleware } from '../middleware/models/PreprocessingMiddleware';

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
