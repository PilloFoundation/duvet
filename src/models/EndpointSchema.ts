import { ZodRawShape } from 'zod';
import { ZodSchemaDefinition } from './ZodSchemaDefinition';
import { ZodRawShapePrimitives } from './ZodRawShapePrimitives';

export interface EndpointSchema<
	RequestBody extends ZodSchemaDefinition,
	ResponseBody extends ZodSchemaDefinition,
	QueryParams extends ZodRawShapePrimitives,
	UrlParams extends ZodRawShapePrimitives,
> {
	requestBody?: RequestBody;
	responseBody?: ResponseBody;
	queryParams?: QueryParams;
	urlParams?: UrlParams;
}
