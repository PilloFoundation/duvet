import { Router } from "express";
import { RouteTreeNode } from "./RouteTreeNode";
import { ZodSchemaDefinition } from "./models/ZodSchemaDefinition";
import { EndpointInformation, Endpoint } from "./models/Endpoint";
import { EndpointSchema } from "./models/EndpointSchema";
import { ZodRawShapePrimitives } from "./models/ZodRawShapePrimitives";
import { ExpressHandlerFunction } from "./models/ExpressHandlerFunction";
import { z } from "zod";
import { Plugin } from "./plugins";

export interface KintBuilder<Context> {
	/**
	 * Creates an express router using the endpoints defined in the given directory.
	 * @param directory The directory of routes to search.
	 * @param context A context object to pass to each handler.
	 * @returns An express router
	 */
	buildExpressRouter: (direcotry: string, context: Context) => Router;

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

	/**
	 * The zod object to use for defining schemas.
	 */
	z: typeof z;
}

type KintParams<Context> = {
	plugins?: Plugin<Context>[];
};

export function kint<Context>(
	params: KintParams<Context>,
): KintBuilder<Context> {
	const kint = {
		buildExpressRouter: (directory: string, context: Context): Router => {
			const routeTree = RouteTreeNode.fromDirectory(directory);

			params.plugins?.forEach((plugin) => plugin.preBuild?.(routeTree));

			return routeTree.toExpressRouter(() => context);
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
		z,
	};

	params.plugins?.forEach((plugin) => plugin.extend?.(kint));

	return kint;
}
