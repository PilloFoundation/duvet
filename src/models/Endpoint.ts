import { Kint } from './Kint/Kint';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PostProcessorCatchTypes } from '../middleware/utils/PostProcessorCatchTypes';
import { RawKintRequest } from './RawKintRequest';
import { MaybePromise } from '../utils/types/MaybePromise';

export type Endpoint<
	Context,
	Config,
	HandlerInput,
	PostProcessors extends PostProcessingMiddlewareTuple
> = {
	kint: Kint<Context, Config, HandlerInput, PostProcessors>;
	config: Config;
	handler: (
		request: HandlerInput,
		context: Context,
		config: Config
	) => MaybePromise<PostProcessorCatchTypes<PostProcessors>>;
};
