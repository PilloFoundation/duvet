import { Kint } from './Kint/Kint';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PostProcessorCatchTypes } from '../middleware/utils/PostProcessorCatchTypes';
import { PreProcessorMutationType } from '../middleware/utils/PreProcessorMutationType';
import { KintRequest } from './KintRequest';
import { MaybePromise } from '../utils/types/MaybePromise';
import { PreprocessingMiddlewareTuple } from '../middleware/models/PreprocessingMiddlewareTuple';

export type Endpoint<
	Context,
	Config,
	PreProcessors extends PreprocessingMiddlewareTuple,
	PostProcessors extends PostProcessingMiddlewareTuple
> = {
	kint: Kint<Context, Config, PreProcessors, PostProcessors>;
	config: Config;
	handler: (
		request: PreProcessorMutationType<PreProcessors> & KintRequest,
		context: Context,
		config: Config
	) => MaybePromise<PostProcessorCatchTypes<PostProcessors>>;
};
