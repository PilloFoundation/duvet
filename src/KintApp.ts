import { Endpoint } from './models/Endpoint';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';
import { EndpointSchema } from './models/EndpointSchema';
import { ExpressHandlerFunction as ExpressBasedHandlerFunction } from './models/ExpressHandlerFunction';
import { RouteTreeNode } from './RouteTreeNode';
import { Router } from 'express';
import { ZodRawShapePrimitives } from './models/ZodRawShapePrimitives';

export class KintApp<C> {
	private _context: C;

	/**
	 * @param context - A context object to be passed to the endpoint handlers.
	 */
	constructor(context: C) {
		this._context = context;
	}

	/**
	 * Defines a single endpoint under the kint framework. This does not specify a path or method. It is simply a typed definition of a handler.
	 * Some other routing method must be used to run this handler.
	 * @param schema An endpoint schema object that defines the request and response schemas using zod.
	 * @param handler A function which handles the request and sends a response (backed by express) and using a response.
	 * @returns An endpoint object.
	 */
	public defineExpressEndpoint<
		RequestBody extends ZodSchemaDefinition,
		QueryParams extends ZodRawShapePrimitives,
		UrlParams extends ZodRawShapePrimitives,
		ResponseBody extends ZodSchemaDefinition,
	>(
		schema: EndpointSchema<RequestBody, ResponseBody, QueryParams, UrlParams>,
		handler: ExpressBasedHandlerFunction<
			C,
			RequestBody,
			ResponseBody,
			QueryParams,
			UrlParams
		>
	): Endpoint<C, RequestBody, ResponseBody, QueryParams, UrlParams> & {
		builtByKint: true;
	} {
		return {
			endpointSchema: schema,
			handler,
			builtByKint: true,
		};
	}

	public descrbeExpressEndpoint<
		RequestBody extends ZodSchemaDefinition,
		QueryParams extends ZodRawShapePrimitives,
		UrlParams extends ZodRawShapePrimitives,
		ResponseBody extends ZodSchemaDefinition,
	>(
		description: string,
		schema: EndpointSchema<RequestBody, ResponseBody, QueryParams, UrlParams>,
		handler: ExpressBasedHandlerFunction<
			C,
			RequestBody,
			ResponseBody,
			QueryParams,
			UrlParams
		>
	): Endpoint<C, RequestBody, ResponseBody, QueryParams, UrlParams> & {
		builtByKint: true;
	} {
		return {
			description,
			endpointSchema: schema,
			handler,
			builtByKint: true,
		};
	}

	/**
	 * Creates an express router using the endpoints defined in the given directory.
	 * @param directory The directory of routes to search.
	 * @returns An express router
	 */
	public async buildExpressRouterFromDirectory(
		directory: string
	): Promise<Router> {
		const routeTree = await RouteTreeNode.fromDirectory(directory);

		return routeTree.toExpressRouter(this._context);
	}
}
