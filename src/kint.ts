import { RouteTreeNode } from "./RouteTreeNode";
import { ZodSchemaDefinition } from "./models/ZodSchemaDefinition";
import { EndpointInformation, Endpoint } from "./models/Endpoint";
import { EndpointSchema } from "./models/EndpointSchema";
import { ZodRawShapePrimitives } from "./models/ZodRawShapePrimitives";
import { ExpressHandlerFunction } from "./models/ExpressHandlerFunction";
import { AppBuilder } from "./models/AppBuilder";
import { RouterFromAppBuilder } from "./models/RouterFromAppBuilder";

export interface KintBuilder<Context> {
	/**
	 * Creates an express router using the endpoints defined in the given directory.
	 * @param directory The directory of routes to search.
	 * @param context A context object to pass to each handler.
	 * @param appBuilder A builder for the router to use. Defaults to the default express router builder.
	 * @returns An express router
	 */
	buildRouter<CustomAppBuilder extends AppBuilder<Context, any>>(
		directory: string,
		context: Context,
		appBuilder: CustomAppBuilder,
	): RouterFromAppBuilder<CustomAppBuilder>;

	/**
	 * Creates an endpoint with the given schema and handler.
	 * @param meta The schema for the endpoint, as well as additional information about the endpoint.
	 * @param handler The handler for the endpoint.
	 * @returns And Endpoint object which can be built into a route.
	 */
	defineExpressEndpoint<
		RequestBody extends ZodSchemaDefinition,
		QueryParams extends ZodRawShapePrimitives,
		UrlParams extends ZodRawShapePrimitives,
		ResponseBody extends ZodSchemaDefinition,
	>(
		meta: EndpointSchema<RequestBody, ResponseBody, QueryParams, UrlParams> &
			EndpointInformation,
		handler: ExpressHandlerFunction<
			Context,
			RequestBody,
			ResponseBody,
			QueryParams,
			UrlParams
		>,
	): Endpoint<Context, RequestBody, ResponseBody, QueryParams, UrlParams>;
}

export function kint<Context>(): KintBuilder<Context> {
	return {
		buildRouter: <CustomAppBuilder extends AppBuilder<Context, any>>(
			directory: string,
			context: Context,
			appBuilder: CustomAppBuilder,
		) => {
			const routeTree = RouteTreeNode.fromDirectory(directory);

			return appBuilder.build(routeTree, context);
		},
		defineExpressEndpoint<
			RequestBody extends ZodSchemaDefinition,
			QueryParams extends ZodRawShapePrimitives,
			UrlParams extends ZodRawShapePrimitives,
			ResponseBody extends ZodSchemaDefinition,
		>(
			meta: EndpointSchema<RequestBody, ResponseBody, QueryParams, UrlParams> &
				EndpointInformation,
			handler: ExpressHandlerFunction<
				Context,
				RequestBody,
				ResponseBody,
				QueryParams,
				UrlParams
			>,
		): Endpoint<Context, RequestBody, ResponseBody, QueryParams, UrlParams> & {
			builtByKint: true;
		} {
			return {
				information: meta,
				schema: meta,
				handler,
				builtByKint: true,
			};
		},
	};
}
