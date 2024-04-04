import { ZodRawShape } from 'zod';
import { ZodSchemaDefinition } from './ZodSchemaDefinition';
import { ZodRawShapePrimitives } from './ZodRawShapePrimitives';

export interface EndpointSchema<
	RequestBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	ResponseBody extends ZodSchemaDefinition = ZodSchemaDefinition,
	QueryParams extends ZodRawShapePrimitives = ZodRawShapePrimitives,
	UrlParams extends ZodRawShapePrimitives = ZodRawShapePrimitives,
> {
	requestBody?: RequestBody;
	responseBody?: ResponseBody;
	queryParams?: QueryParams;
	urlParams?: UrlParams;
}
