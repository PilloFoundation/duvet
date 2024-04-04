import { Endpoint } from './models/Endpoint';
import { RequestHandler, Request, Response } from 'express';
import { parseSchemaDefinition } from './parseSchemaDefinition';

export function createHandlerFromEndpoint<C>(
	endpoint: Endpoint<C>,
	context: C
): RequestHandler {
	return async (req: Request, res: Response, next) => {
		const parsedBody = parseSchemaDefinition(
			endpoint.endpointSchema.requestBody ?? {},
			req.body
		);

		if (parsedBody.success === false) {
			res.status(400).send('Bad request: ' + parsedBody.error.message);
			return;
		}
		req.body = parsedBody.data;

		const parsedQueryParams = parseSchemaDefinition(
			endpoint.endpointSchema.queryParams ?? {},
			req.query
		);
		if (parsedQueryParams.success === false) {
			res.status(400).send('Bad request: ' + parsedQueryParams.error.message);
			return;
		}
		req.query = parsedQueryParams.data;

		const parsedUrlParams = parseSchemaDefinition(
			endpoint.endpointSchema.urlParams ?? {},
			req.params
		);
		if (parsedUrlParams.success === false) {
			res.status(400).send('Bad request: ' + parsedUrlParams.error.message);
			return;
		}
		req.params = parsedUrlParams.data;

		await endpoint.handler(req, res, context);
		next();

		return;
	};
}
