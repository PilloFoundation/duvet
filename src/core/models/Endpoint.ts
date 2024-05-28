import { KintRequest } from './KintRequest';
import { KintResponse } from './KintResponse';
import { PostProcessingMiddlewareTuple } from './middleware/PostProcessingMiddlewareTuple';
import { PreprocessingMiddlewareTuple } from './middleware/PreprocessingMiddlewareTuple';
import { PostProcessorCatchTypes } from './middleware/utils/PostProcessorCatchTypes';
import { PreProcessorsMutationType } from './middleware/utils/PreProcessorMutationType';
import { MaybePromise } from '../../utils/types/MaybePromise';

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
