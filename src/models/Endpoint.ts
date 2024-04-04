import { EndpointSchema } from './EndpointSchema';
import { ZodSchemaDefinition } from './ZodSchemaDefinition';
import { InferZodSchemaDefinition } from './InferSchemaDefinition';
import { Request, Response } from 'express';
import { ZodRawShapePrimitives } from './ZodRawShapePrimitives';

export interface Endpoint<
	Context,
	RequestBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	ResponseBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	QueryParams extends ZodRawShapePrimitives = ZodRawShapePrimitives,
	UrlParams extends ZodRawShapePrimitives = ZodRawShapePrimitives,
> {
	description?: string;
	endpointSchema: EndpointSchema<
		RequestBody,
		ResponseBody,
		QueryParams,
		UrlParams
	>;
	handler: (
		request: Request<
			InferZodSchemaDefinition<UrlParams>,
			InferZodSchemaDefinition<ResponseBody>,
			InferZodSchemaDefinition<RequestBody>,
			InferZodSchemaDefinition<QueryParams>
		>,
		response: Response<InferZodSchemaDefinition<ResponseBody>>,
		context: Context
	) => Promise<void> | void;
}
