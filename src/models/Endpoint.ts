import { EndpointSchema } from './EndpointSchema';
import { ZSD } from './ZodSchemaDefinition';
import { IZSDI, IZSDO } from './InferSchemaDefinition';
import { NextFunction, Request, Response } from 'express';
import { ZRSP } from './ZodRawShapePrimitives';

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
			IZSDO<UrlParams>,
			IZSDI<ResponseBody>,
			IZSDO<RequestBody>,
			IZSDO<QueryParams>
		>,
		response: Response<IZSDI<ResponseBody>>,
		context: Context,
		next: NextFunction
	) => Promise<void> | void;
};

export type EndpointInformation = {
	description?: string;
	summary?: string;
};
