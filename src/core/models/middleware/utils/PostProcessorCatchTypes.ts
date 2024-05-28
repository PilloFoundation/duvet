import { PostProcessingMiddlewareTuple } from '../PostProcessingMiddlewareTuple';
import { PostProcessingMiddleware } from '../PostProcessingMiddleware';

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
