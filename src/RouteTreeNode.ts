import fs from 'fs';
import path from 'path';
import { Method, Resource } from './models/Resource';
import { Endpoint } from './models/Endpoint';
import { z } from 'zod';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';
import { RequestHandler, Router, Request, Response } from 'express';

export class RouteTreeNode<Context> {
	public subRoutes: RouteTreeNode<Context>[] = [];

	constructor(
		public name: string,
		public isUrlParam: boolean,
		public resource: Resource<Context> = {}
	) {}

	/**
	 * Populates a route tree node with the contents from a directory.
	 *
	 * @param directory - The directory path.
	 */
	private async populateWithDirectoryContents(directory: string) {
		const directoryContents = fs.readdirSync(directory);

		for (const currentFileName of directoryContents) {
			// Get the absolute path to the current file
			const absolutePathToCurrentFile = path.join(directory, currentFileName);
			const stat = fs.statSync(absolutePathToCurrentFile);

			if (stat.isDirectory()) {
				// Current file is a directory
				const newRouteTreeNode = RouteTreeNode.createSubRoute(currentFileName);

				// Recursively populate the new route tree node
				await newRouteTreeNode.populateWithDirectoryContents(
					absolutePathToCurrentFile
				);

				// Add the new route tree node to the sub routes
				this.subRoutes.push(newRouteTreeNode);
			} else {
				// Current file is not a directory
				const httpMethodRegExp = /^(PUT|POST|GET|DELETE|PATCH)\.(ts|js)$/;

				// Check if it's a method file
				const methodMatch = currentFileName.match(httpMethodRegExp);

				if (methodMatch) {
					const method = methodMatch[1] as Method;

					const fullPath = path.parse(absolutePathToCurrentFile);
					const moduleName = path.join(fullPath.dir, fullPath.name);

					const endpoint = require(moduleName) as {
						default: Endpoint<Context>;
					};

					this.resource[method] = endpoint.default;
				}
			}
		}
	}

	private static createSubRoute<C>(directoryName: string): RouteTreeNode<C> {
		// Check if it's a url param
		const urlParamRegExp = /^\[(\w+)\]$/;
		const result = directoryName.match(urlParamRegExp);
		const isUrlParam = result !== null;
		const routeName = isUrlParam ? result[1] : directoryName;

		const route = new RouteTreeNode(routeName, isUrlParam);

		return route;
	}

	public static async fromDirectory<C>(
		directory: string
	): Promise<RouteTreeNode<C>> {
		const routeTree = new RouteTreeNode('root', false);

		await routeTree.populateWithDirectoryContents(directory);

		return routeTree;
	}

	public toExpressRouter(context: Context, currentPath: string = '') {
		const expressRouter = Router({
			mergeParams: true,
		});

		this.applyResource(expressRouter, this.resource, context);

		for (const subRoute of this.subRoutes) {
			const subRouter = subRoute.toExpressRouter(
				context,
				currentPath + '/' + subRoute.name
			);

			const routePath = '/' + (subRoute.isUrlParam ? ':' : '') + subRoute.name;

			expressRouter.use(routePath, subRouter);
		}

		return expressRouter;
	}

	private applyResource<C>(router: Router, resource: Resource<C>, context: C) {
		const { GET, POST, PATCH, DELETE, PUT } = resource;

		GET && router.get('/', this.createHandlerFromEndpoint(GET, context));
		PUT && router.put('/', this.createHandlerFromEndpoint(PUT, context));
		POST && router.post('/', this.createHandlerFromEndpoint(POST, context));
		PATCH && router.patch('/', this.createHandlerFromEndpoint(PATCH, context));
		DELETE &&
			router.delete('/', this.createHandlerFromEndpoint(DELETE, context));
	}

	private createHandlerFromEndpoint<C>(
		endpoint: Endpoint<C>,
		context: C
	): RequestHandler {
		return async (req: Request, res: Response, next) => {
			const parsedBody = RouteTreeNode.parseSchemaDefinition(
				endpoint.endpointDefinition.requestBody ?? {},
				req.body
			);

			if (parsedBody.success === false) {
				res.status(400).send('Bad request: ' + parsedBody.error.message);
				return;
			}
			req.body = parsedBody.data;

			const parsedQueryParams = RouteTreeNode.parseSchemaDefinition(
				endpoint.endpointDefinition.queryParams ?? {},
				req.query
			);
			if (parsedQueryParams.success === false) {
				res.status(400).send('Bad request: ' + parsedQueryParams.error.message);
				return;
			}
			req.query = parsedQueryParams.data;

			const parsedUrlParams = RouteTreeNode.parseSchemaDefinition(
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

	private static parseSchemaDefinition<T extends ZodSchemaDefinition, U>(
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
}
