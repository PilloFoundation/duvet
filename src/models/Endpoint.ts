import { EndpointSchema } from './EndpointSchema';
import { ZodSchemaDefinition } from './ZodSchemaDefinition';
import { InferZodSchemaDefinition } from './InferSchemaDefinition';
import { Request, Response } from 'express';

export interface Endpoint<
	Context,
	RequestBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	ResponseBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	QueryParams extends ZodSchemaDefinition = ZodSchemaDefinition,
	UrlParams extends ZodSchemaDefinition = ZodSchemaDefinition,
> {
	endpointDefinition: EndpointSchema<
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
