import { PostProcessingMiddlewareTuple } from '../models/PostProcessingMiddlewareTuple';
import { PostProcessingMiddleware } from '../models/PostProcessingMiddleware';

export type PostProcessorCatchTypes<
	ConcretePostProcessingMiddlewareTuple extends PostProcessingMiddlewareTuple
> = ConcretePostProcessingMiddlewareTuple[number] extends []
	? never
	: ConcretePostProcessingMiddlewareTuple[number] extends PostProcessingMiddleware<
			any,
			infer CatchType
	  >
	? CatchType
	: never;
