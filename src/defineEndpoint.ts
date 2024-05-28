import { Kint } from './models/Kint';
import { PostProcessingMiddlewareTuple } from './middleware/models/PostProcessingMiddlewareTuple';
import { PostProcessorCatchTypes } from './middleware/utils/PostProcessorCatchTypes';
import { mergeConfigs } from './utils/mergeConfigs';
import { processOutput } from './processOutput';
import { RawKintRequest } from './models/RawKintRequest';

function defineEndpoint<
	Context,
	Config,
	HandlerInput,
	PostProcessors extends PostProcessingMiddlewareTuple
>(
	kint: Kint<Context, Config, HandlerInput, PostProcessors>,
	userConfig: Config,
	handler: (
		handlerInput: HandlerInput,
		context: Context,
		userConfig: Config
	) => PostProcessorCatchTypes<PostProcessors>
) {
	return (rawKintRequest: RawKintRequest, context: Context) => {
		const config = mergeConfigs(kint.defaultConfig, userConfig);
		const handlerInput = kint.preProcessor.preProcess(rawKintRequest, config);

		try {
			throw handler(handlerInput, context, config);
		} catch (thrown) {
			return processOutput(kint.postProcessors, rawKintRequest, config, thrown);
		}
	};
}
