import { RawKintRequest } from '../../models/RawKintRequest';
import { RawKintResponse } from '../../models/RawKintResponse';

export type PostProcessingMiddleware<Config, CatchType> = {
	matcher: (thrown: any) => thrown is CatchType;
	catcher: (
		thrown: CatchType,
		request: RawKintRequest,
		config: Config
	) => RawKintResponse;
};
