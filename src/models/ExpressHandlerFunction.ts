import { NextFunction, Request, Response } from 'express';
import { InferZodSchemaDefinition } from './InferSchemaDefinition';
import { ZodSchemaDefinition } from './ZodSchemaDefinition';

export type ExpressHandlerFunction<
	Context,
	RequestBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	ResponseBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	QueryParams extends ZodSchemaDefinition = ZodSchemaDefinition,
	UrlParams extends ZodSchemaDefinition = ZodSchemaDefinition,
> = (
	request: Request<
		InferZodSchemaDefinition<UrlParams>,
		InferZodSchemaDefinition<ResponseBody>,
		InferZodSchemaDefinition<RequestBody>,
		InferZodSchemaDefinition<QueryParams>
	>,
	response: Response<InferZodSchemaDefinition<ResponseBody>>,
	context: Context,
	next: NextFunction
) => Promise<void> | void;
