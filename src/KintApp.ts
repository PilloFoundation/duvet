import { Endpoint } from './models/Endpoint';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';
import { EndpointSchema } from './models/EndpointSchema';
import { ExpressHandlerFunction as ExpressBasedHandlerFunction } from './models/ExpressHandlerFunction';
import { RouteTreeNode } from './RouteTreeNode';
import bodyParser from 'body-parser';

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
		QueryParams extends ZodSchemaDefinition,
		UrlParams extends ZodSchemaDefinition,
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
			endpointDefinition: schema,
			handler,
			builtByKint: true,
		};
	}

	public async buildExpressRouterFromDirectory(directory: string) {
		const routeTree = await RouteTreeNode.fromDirectory(directory);

		const router = routeTree.toExpressRouter(this._context);

		router.use(bodyParser.json());

		return router;
	}
}
