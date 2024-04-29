import { NextFunction, Request, Response } from 'express';
import { IZSDI, IZSDO } from './InferSchemaDefinition';
import { ZSD } from './ZodSchemaDefinition';
import { ZRSP } from './ZodRawShapePrimitives';

export type ExpressHandlerFunction<
	Context,
	RequestBody extends ZSD = ZSD,
	ResponseBody extends ZSD = ZSD,
	QueryParams extends ZRSP = ZRSP,
	UrlParams extends ZRSP = ZRSP,
> = (
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
