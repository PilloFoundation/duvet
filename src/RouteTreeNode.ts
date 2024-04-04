import fs from 'fs';
import path from 'path';
import { Method, Resource } from './models/Resource';
import { Endpoint } from './models/Endpoint';
import { Router } from 'express';
import { toZodObject } from './utils/toZodObject';
import { zodKeys } from './utils/zodKeys';
import { createHandlerFromEndpoint } from './createHandlerFromEndpoint';

export class RouteTreeNode<Context> {
	public subRoutes: RouteTreeNode<Context>[] = [];

	constructor(
		public name: string,
		public isUrlParam: boolean,
		private parent?: RouteTreeNode<Context>,
		public resource: Resource<Context> = {}
	) {}

	/**
	 * Populates a route tree node with the contents from a directory.
	 *
	 * @param rootDirectory - The path to the routes directory.
	 * @param relativePathToRoute - The relative path from the base directory to the current route.
	 */
	private async populateWithDirectoryContents(
		rootDirectory: string,
		relativePathToRoute: string
	) {
		const pathToCurrentRoute = path.join(rootDirectory, relativePathToRoute);

		const directoryContents = fs.readdirSync(pathToCurrentRoute);

		for (const currentFileName of directoryContents) {
			// Get the path to the current file from the routes base directory
			const relativePathToCurrentFile = path.join(
				relativePathToRoute,
				currentFileName
			);
			const absolutePathToCurrentFile = path.join(
				rootDirectory,
				relativePathToCurrentFile
			);

			const stat = fs.statSync(absolutePathToCurrentFile);

			if (stat.isDirectory()) {
				// Current file is a directory
				const newRouteTreeNode = this.createSubRoute(currentFileName);

				// Recursively populate the new route tree node
				await newRouteTreeNode.populateWithDirectoryContents(
					rootDirectory,
					relativePathToCurrentFile
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

					const endpoint = require(moduleName)?.default;

					// Check if the endpoint is a Kint endpoint
					if (isKintEndpoint(endpoint) !== true) {
						throw new Error(
							`Endpoint at route ${relativePathToCurrentFile} is not a Kint endpoint`
						);
					}

					const endpointDefinedUrlParamsSchemaDef =
						endpoint.endpointSchema.urlParams;

					if (endpointDefinedUrlParamsSchemaDef != null) {
						const endpointDefinedUrlsParams = zodKeys(
							toZodObject(endpointDefinedUrlParamsSchemaDef)
						);

						const routeDefinedUrlParams = this.getAllUrlParams();

						for (const urlParam of endpointDefinedUrlsParams) {
							const paramExistsInRoute =
								routeDefinedUrlParams.includes(urlParam);
							if (paramExistsInRoute === false) {
								throw new Error(
									`Endpoint at /${relativePathToCurrentFile} defines a URL parameter in it's schema (${urlParam}) that does not exist in the route path.`
								);
							}
						}
					}

					this.resource[method] = endpoint;
				}
			}
		}
	}

	private createSubRoute(directoryName: string): RouteTreeNode<Context> {
		// Check if it's a url param
		const urlParamRegExp = /^\[(\w+)\]$/;
		const result = directoryName.match(urlParamRegExp);
		const isUrlParam = result !== null;
		const routeName = isUrlParam ? result[1] : directoryName;

		const route = new RouteTreeNode(routeName, isUrlParam, this);

		return route;
	}

	public static async fromDirectory<C>(
		directory: string
	): Promise<RouteTreeNode<C>> {
		const routeTree = new RouteTreeNode('root', false);

		await routeTree.populateWithDirectoryContents(directory, './');

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

		GET && router.get('/', createHandlerFromEndpoint(GET, context));
		PUT && router.put('/', createHandlerFromEndpoint(PUT, context));
		POST && router.post('/', createHandlerFromEndpoint(POST, context));
		PATCH && router.patch('/', createHandlerFromEndpoint(PATCH, context));
		DELETE && router.delete('/', createHandlerFromEndpoint(DELETE, context));
	}

	private getAllUrlParams() {
		const urlParams: string[] = [];

		let currentRoute: RouteTreeNode<Context> | undefined = this;

		while (currentRoute != null) {
			if (currentRoute.isUrlParam) {
				urlParams.push(currentRoute.name);
			}

			currentRoute = currentRoute.parent;
		}

		return urlParams;
	}
}

function isKintEndpoint(test: any): test is Endpoint<any> {
	return test.builtByKint === true;
}
