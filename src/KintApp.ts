import { Endpoint, EndpointInformation } from './models/Endpoint';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';
import { EndpointSchema } from './models/EndpointSchema';
import { ExpressHandlerFunction as ExpressBasedHandlerFunction } from './models/ExpressHandlerFunction';
import { RouteTreeNode } from './RouteTreeNode';
import { Router } from 'express';
import { ZodRawShapePrimitives } from './models/ZodRawShapePrimitives';

export class KintApp<Context> {
	private _context: Context;

	/**
	 * @param context - A context object to be passed to the endpoint handlers.
	 */
	constructor(context: Context) {
		this._context = context;
	}

	/**
	 * @param context - A context object to be passed to the endpoint handlers.
	 */
	public set context(context: Context) {
		this._context = context;
	}

	/**
	 * @returns The context object passed to the endpoint handlers.
	 */
	public get context(): Context {
		return this._context;
	}

	/**
	 * Defines a single endpoint under the kint framework. This does not specify a path or method. It is simply a typed definition of a handler.
	 * Some other routing method must be used to run this handler.
	 *
	 * @param meta Additional information to help define the endpoint.
	 * @param handler A function which handles the request and sends a response (backed by express) and using a response.
	 * @returns An endpoint object.
	 */
	public defineExpressEndpoint<
		RequestBody extends ZodSchemaDefinition,
		QueryParams extends ZodRawShapePrimitives,
		UrlParams extends ZodRawShapePrimitives,
		ResponseBody extends ZodSchemaDefinition,
	>(
		meta: EndpointSchema<RequestBody, ResponseBody, QueryParams, UrlParams> &
			EndpointInformation,
		handler: ExpressBasedHandlerFunction<
			Context,
			RequestBody,
			ResponseBody,
			QueryParams,
			UrlParams
		>
	): Endpoint<Context, RequestBody, ResponseBody, QueryParams, UrlParams> & {
		builtByKint: true;
	} {
		return {
			information: meta,
			schema: meta,
			handler,
			builtByKint: true,
		};
	}

	/**
	 * Creates an express router using the endpoints defined in the given directory.
	 * @param directory The directory of routes to search.
	 * @returns An express router
	 */
	public buildExpressRouterFromDirectory(directory: string): Router {
		const routeTree = RouteTreeNode.fromDirectory(directory);

		return routeTree.toExpressRouter(() => this._context);
	}
}
