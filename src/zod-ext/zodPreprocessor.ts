import { PreprocessingMiddleware } from '../middleware/models/PreprocessingMiddleware';
import { KintRequest } from '../models/KintRequest';
import { InferZodSchemaDefinitionInput } from './utils/InferSchemaDefinition';
import { ZodEndpointConfig } from './models/ZodEndpointConfig';
import { ZodRawShapePrimitives } from './models/ZodRawShapePrimitives';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';
import { parseSchemaDefinition } from './parseSchemaDefinition';

export type Parsed<
	Body extends ZodSchemaDefinition,
	UrlParams extends ZodRawShapePrimitives,
	QueryParams extends ZodRawShapePrimitives
> = {
	body: InferZodSchemaDefinitionInput<Body>;
	urlParams: InferZodSchemaDefinitionInput<UrlParams>;
	queryParams: InferZodSchemaDefinitionInput<QueryParams>;
};

export function zodPreprocessor<
	Body extends ZodSchemaDefinition,
	UrlParams extends ZodRawShapePrimitives,
	QueryParams extends ZodRawShapePrimitives
>(): PreprocessingMiddleware<
	Partial<ZodEndpointConfig<Body, UrlParams, QueryParams>>,
	Parsed<Body, UrlParams, QueryParams>
> {
	return {
		defaultConfig: {
			queryParams: undefined,
			requestBody: undefined,
			urlParams: undefined,
		},
		preProcess(request, config) {
			const req = request.underlyingExpressRequest;

			const parsed: Partial<Parsed<Body, UrlParams, QueryParams>> = {};

			// Check if the request has a body, if not throw an error saying the body was not parsed and the user needs parsing middleware
			if (!req.body) {
				throw new Error(
					'Request body not parsed, please use body parsing middleware'
				);
			}

			const parsedBody = parseSchemaDefinition(
				config.requestBody ?? {},
				req.body
			);

			if (parsedBody.success === false) {
				throw new Error('Bad request: ' + parsedBody.error.message);
			}

			parsed.body = parsedBody.data;

			const parsedQueryParams = parseSchemaDefinition(
				config.queryParams ?? {},
				req.query
			);
			if (parsedQueryParams.success === false) {
				throw new Error('Bad request: ' + parsedQueryParams.error.message);
			}
			parsed.queryParams = parsedQueryParams.data;

			const parsedUrlParams = parseSchemaDefinition(
				config.urlParams ?? {},
				req.params
			);
			if (parsedUrlParams.success === false) {
				throw new Error('Bad request: ' + parsedUrlParams.error.message);
			}
			parsed.urlParams = parsedUrlParams.data;
		},
	};
}
