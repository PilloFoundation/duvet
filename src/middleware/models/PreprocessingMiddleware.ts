import { RawKintRequest } from '../../models/RawKintRequest';

export type PreprocessingMiddleware<
	Config,
	OutputRequest,
	InputRequest = RawKintRequest
> = {
	preProcess: (request: InputRequest, config: Config) => OutputRequest;
	defaultConfig: Config;
};
