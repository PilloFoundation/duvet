import fs from 'fs';
import path from 'path';
import { Method, Resource } from './models/Resource';
import { Endpoint } from './models/Endpoint';

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

	public static async buildRouteTree<C>(
		directory: string
	): Promise<RouteTreeNode<C>> {
		const routeTree = new RouteTreeNode('root', false);

		await routeTree.populateWithDirectoryContents(directory);

		return routeTree;
	}
}
