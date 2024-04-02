import { ZodSchemaDefinition } from './ZodSchemaDefinition';

export interface EndpointSchema<
	RequestBody extends ZodSchemaDefinition,
	ResponseBody extends ZodSchemaDefinition,
	QueryParams extends ZodSchemaDefinition,
	UrlParams extends ZodSchemaDefinition,
> {
	requestBody?: RequestBody;
	responseBody?: ResponseBody;
	queryParams?: QueryParams;
	urlParams?: UrlParams;
}
