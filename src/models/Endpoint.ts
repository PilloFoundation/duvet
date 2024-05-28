import { Kint } from './Kint';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { PostProcessorCatchTypes } from '../middleware/utils/PostProcessorCatchTypes';

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
		context: Context
	) =>
		| Promise<PostProcessorCatchTypes<PostProcessors>>
		| PostProcessorCatchTypes<PostProcessors>;
};
