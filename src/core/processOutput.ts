import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { RawKintRequest } from '../models/RawKintRequest';
import { RawKintResponse } from '../models/RawKintResponse';

export function processOutput<
	PostProcessors extends PostProcessingMiddlewareTuple,
	Config
>(
	postProcessors: PostProcessors,
	rawKintRequest: RawKintRequest,
	config: Config,
	response: any
): RawKintResponse {
	for (const postProcessor of postProcessors) {
		if (postProcessor.matcher(response)) {
			return postProcessor.catcher(response, rawKintRequest, config);
		}
	}
	return {};
}
