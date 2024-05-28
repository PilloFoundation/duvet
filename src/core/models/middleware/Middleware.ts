import { object } from 'zod';
import { KintRequest } from '../KintRequest';
import { PostProcessingMiddleware } from './PostProcessingMiddleware';
import { PreprocessingMiddleware } from './PreprocessingMiddleware';

export type Middleware<
	Config,
	RequestExtension extends object,
	CatchType extends object
> = PostProcessingMiddleware<Config, CatchType> &
	PreprocessingMiddleware<Config, RequestExtension>;
