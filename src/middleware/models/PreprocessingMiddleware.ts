import { KintRequest } from '../../models/KintRequest';
import { KintResponse } from '../../models/KintResponse';

export type PreprocessingMiddleware<Config, RequestExtension = {}> = {
	preProcess: (
		request: KintRequest,
		config: Config
	) => RequestExtension | KintResponse;
	defaultConfig: Config;
};
