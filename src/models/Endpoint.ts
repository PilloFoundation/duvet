import { Kint } from './Kint';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PostProcessorCatchTypes } from '../middleware/utils/PostProcessorCatchTypes';
import { PreProcessorsMutationType } from '../middleware/utils/PreProcessorMutationType';
import { KintRequest } from './KintRequest';
import { MaybePromise } from '../utils/types/MaybePromise';
import { PreprocessingMiddlewareTuple } from '../middleware/models/PreprocessingMiddlewareTuple';
import { KintResponse } from './KintResponse';

export type Endpoint<
	Context,
	Config,
	PreProcessors extends PreprocessingMiddlewareTuple,
	PostProcessors extends PostProcessingMiddlewareTuple
> = {
	preProcessors: PreProcessors;
	postProcessors: PostProcessors;
	config: Config;
	handler: (
		request: PreProcessorsMutationType<PreProcessors> & KintRequest,
		context: Context,
		config: Config
	) => MaybePromise<PostProcessorCatchTypes<PostProcessors> | KintResponse>;
};
