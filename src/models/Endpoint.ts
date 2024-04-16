import { EndpointSchema } from './EndpointSchema';
import { ZodSchemaDefinition } from './ZodSchemaDefinition';
import { InferZodSchemaDefinition } from './InferSchemaDefinition';
import { NextFunction, Request, Response } from 'express';
import { ZodRawShapePrimitives } from './ZodRawShapePrimitives';

type ZRSP = ZodRawShapePrimitives;
type ZSD = ZodSchemaDefinition;
type IZSD<Z extends ZSD> = InferZodSchemaDefinition<Z>;

export type Endpoint<
	Context,
	RequestBody extends ZSD = ZSD,
	ResponseBody extends ZSD = ZSD,
	QueryParams extends ZRSP = ZRSP,
	UrlParams extends ZRSP = ZRSP,
> = {
	information: EndpointInformation;
	schema: EndpointSchema<RequestBody, ResponseBody, QueryParams, UrlParams>;
	handler: (
		request: Request<
			IZSD<UrlParams>,
			IZSD<ResponseBody>,
			IZSD<RequestBody>,
			IZSD<QueryParams>
		>,
		response: Response<IZSD<ResponseBody>>,
		context: Context,
		next: NextFunction
	) => Promise<void> | void;
};

export type EndpointInformation = {
	description?: string;
	summary?: string;
};
