import { KintRequest } from '../../models/KintRequest';
import { RawKintResponse } from '../../models/RawKintResponse';

export type PostProcessingMiddleware<Config, CatchType> = {
	defaultConfig: Config;
	matcher: (thrown: any) => thrown is CatchType;
	catcher: (
		thrown: CatchType,
		request: KintRequest,
		config: Config
	) => RawKintResponse;
};
