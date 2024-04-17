import { Endpoint } from './models/Endpoint';
import { RequestHandler, Request, Response } from 'express';
import { parseSchemaDefinition } from './parseSchemaDefinition';

export function createHandlerFromEndpoint<C>(
	endpoint: Endpoint<C>,
	getContext: () => C
): RequestHandler {
	return async (req: Request, res: Response, next) => {
		// Check if the request has a body, if not throw an error saying the body was not parsed and the user needs parsing middleware
		if (!req.body) {
			res
				.status(500)
				.send(
					'Request body does not exist. Please use body-parser or similar middleware to parse the request body.'
				);
			next();
			return;
		}

		const parsedBody = parseSchemaDefinition(
			endpoint.schema.requestBody ?? {},
			req.body
		);

		if (parsedBody.success === false) {
			res.status(400).send('Bad request: ' + parsedBody.error.message);
			next();
			return;
		}
		req.body = parsedBody.data;

		const parsedQueryParams = parseSchemaDefinition(
			endpoint.schema.queryParams ?? {},
			req.query
		);
		if (parsedQueryParams.success === false) {
			res.status(400).send('Bad request: ' + parsedQueryParams.error.message);
			next();
			return;
		}
		req.query = parsedQueryParams.data;

		const parsedUrlParams = parseSchemaDefinition(
			endpoint.schema.urlParams ?? {},
			req.params
		);
		if (parsedUrlParams.success === false) {
			res.status(400).send('Bad request: ' + parsedUrlParams.error.message);
			next();
			return;
		}
		req.params = parsedUrlParams.data;

		const handle = endpoint.handler(req, res, getContext(), next);

		if (handle instanceof Promise) {
			handle.then(next);
		} else {
			next();
		}

		return;
	};
}
