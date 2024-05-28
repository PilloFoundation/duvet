import { Kint } from './models/Kint/Kint';
import { PostProcessingMiddlewareTuple } from './middleware/models/PostProcessingMiddlewareTuple';
import { PostProcessorCatchTypes } from './middleware/utils/PostProcessorCatchTypes';
import { Endpoint } from './models/Endpoint';
import { MaybePromise } from './utils/types/MaybePromise';

export function defineEndpoint<
	Context,
	Config,
	HandlerInput,
	PostProcessors extends PostProcessingMiddlewareTuple
>(
	kint: Kint<Context, Config, HandlerInput, PostProcessors>,
	config: Config,
	handler: (
		request: HandlerInput,
		context: Context,
		config: Config
	) => MaybePromise<PostProcessorCatchTypes<PostProcessors>>
): Endpoint<Context, Config, HandlerInput, PostProcessors> {
	return {
		kint,
		config,
		handler,
	};
}
