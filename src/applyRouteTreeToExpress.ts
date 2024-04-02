/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { RequestHandler, Router, Request, Response } from 'express';
import { z } from 'zod';
import { RouteTreeNode } from './RouteTreeNode';
import { Resource } from './models/Resource';
import { Endpoint } from './models/Endpoint';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';

export function applyRouteTreeNodeToExpressRouter<C>(
	router: Router,
	rootRouteTreeNode: RouteTreeNode<C>,
	context: C,
	currentPath: string = ''
) {
	applySingleResourceToExpressRouterAsIndex(
		router,
		rootRouteTreeNode.resource,
		context
	);

	for (const subRoute of rootRouteTreeNode.subRoutes) {
		const expressRouter = Router({
			mergeParams: true,
		});

		applyRouteTreeNodeToExpressRouter(
			expressRouter,
			subRoute,
			context,
			currentPath + '/' + subRoute.name
		);

		const routePath = '/' + (subRoute.isUrlParam ? ':' : '') + subRoute.name;

		router.use(routePath, expressRouter);
	}
}

function applySingleResourceToExpressRouterAsIndex<C>(
	router: Router,
	resource: Resource<C>,
	context: C
) {
	const { GET, POST, PATCH, DELETE, PUT } = resource;

	GET && router.get('/', createHandlerFromEndpoint(GET, context));
	PUT && router.put('/', createHandlerFromEndpoint(PUT, context));
	POST && router.post('/', createHandlerFromEndpoint(POST, context));
	PATCH && router.patch('/', createHandlerFromEndpoint(PATCH, context));
	DELETE && router.delete('/', createHandlerFromEndpoint(DELETE, context));
}

function createHandlerFromEndpoint<C>(
	endpoint: Endpoint<C>,
	context: C
): RequestHandler {
	return async (req: Request, res: Response, next) => {
		const parsedBody = parseSchemaDefinition(
			endpoint.endpointDefinition.requestBody ?? {},
			req.body
		);

		if (parsedBody.success === false) {
			res.status(400).send('Bad request: ' + parsedBody.error.message);
			return;
		}
		req.body = parsedBody.data;

		const parsedQueryParams = parseSchemaDefinition(
			endpoint.endpointDefinition.queryParams ?? {},
			req.query
		);
		if (parsedQueryParams.success === false) {
			res.status(400).send('Bad request: ' + parsedQueryParams.error.message);
			return;
		}
		req.query = parsedQueryParams.data;

		const parsedUrlParams = parseSchemaDefinition(
			endpoint.endpointDefinition.urlParams ?? {},
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

function parseSchemaDefinition<T extends ZodSchemaDefinition, U>(
	schemaDefinition: T,
	parseObject: U
) {
	if (schemaDefinition instanceof z.ZodType) {
		return schemaDefinition.safeParse(parseObject);
	} else {
		const zodObject = z.object(schemaDefinition);
		return zodObject.safeParse(parseObject);
	}
}
