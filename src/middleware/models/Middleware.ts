import { KintRequest } from '../../models/KintRequest';
import { PostProcessingMiddleware } from './PostProcessingMiddleware';
import { PreprocessingMiddleware } from './PreprocessingMiddleware';

export type Middleware<Config, RequestExtension, CatchType> =
	PostProcessingMiddleware<Config, CatchType> &
		PreprocessingMiddleware<Config, RequestExtension>;
