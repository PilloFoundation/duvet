import { KintResponse } from '../../models/KintResponse';
import { PreprocessingMiddleware } from '../models/PreprocessingMiddleware';

export type ExtractRequestExtension<T> = T extends PreprocessingMiddleware<
	any,
	infer RequestExtension
>
	? RequestExtension
	: never;
