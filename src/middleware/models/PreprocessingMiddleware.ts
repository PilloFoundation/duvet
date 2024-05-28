import { RawKintRequest } from '../../models/RawKintRequest';

export type PreprocessingMiddleware<
	Config,
	RequestExtension = {},
	PreviousHandlerInput extends RawKintRequest = any
> = {
	preProcess: (
		request: PreviousHandlerInput,
		config: Config
	) => PreviousHandlerInput & RequestExtension;
	defaultConfig: Config;
};
