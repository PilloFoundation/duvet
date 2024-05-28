import { RawKintRequest } from '../../models/RawKintRequest';
import { PreprocessingMiddleware } from './PreprocessingMiddleware';

export type StrictPreprocessingMiddleware<
	Config,
	OutputRequest extends RawKintRequest,
	InputRequest = RawKintRequest
> = PreprocessingMiddleware<Config, OutputRequest, InputRequest>;
