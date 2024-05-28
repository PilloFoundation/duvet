import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { KintRequest } from '../models/KintRequest';
import { RawKintResponse } from '../models/RawKintResponse';

export function processOutput<
	PostProcessors extends PostProcessingMiddlewareTuple,
	Config
>(
	postProcessors: PostProcessors,
	rawKintRequest: KintRequest,
	config: Config,
	response: any
): RawKintResponse {
	for (const postProcessor of postProcessors) {
		if (postProcessor.matcher(response)) {
			return postProcessor.handler(response, rawKintRequest, config);
		}
	}
	return {};
}
