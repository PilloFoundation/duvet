import { RouteTreeNode } from "../../RouteTreeNode";
import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { Resource } from "../../models/Resource";
import { Endpoint } from "../../models/Endpoint";
import fs from "fs";
import { AnyZodObject, ZodEffects } from "zod";
import { z } from ".";

export function registerPathFromEndpoint(
	registry: OpenAPIRegistry,
	method: "get" | "post" | "put" | "patch" | "delete",
	endpoint: Endpoint<unknown>,
	path: string,
) {
	registry.registerPath({
		method,
		path,
		description: endpoint.information.description,
		summary: endpoint.information.summary,
		request: {
			body: {
				content: {
					"application/json": {
						schema: endpoint.schema.requestBody ?? z.object({}),
					},
				}, // TODO: Fix. Just for testing
			},
		},
		responses: {
			"200": {
				description: "Success",
				content: {
					"application/json": {
						schema: endpoint.schema.responseBody ?? z.object({}),
					}, // TODO: Fix. Just for testing
				},
			},
		},
	});
}

const applyResource = (
	registry: OpenAPIRegistry,
	resource: Resource<unknown>,
	currentPath: string,
) => {
	const { GET, POST, PATCH, DELETE, PUT } = resource;

	GET && registerPathFromEndpoint(registry, "get", GET, currentPath);
	PUT && registerPathFromEndpoint(registry, "put", PUT, currentPath);
	POST && registerPathFromEndpoint(registry, "post", POST, currentPath);
	PATCH && registerPathFromEndpoint(registry, "patch", PATCH, currentPath);
	DELETE && registerPathFromEndpoint(registry, "delete", DELETE, currentPath);
};

export const generateOpenApiDocsFromRouteTreeWithPath = (
	routeTree: RouteTreeNode<unknown>,
	registry: OpenAPIRegistry | null = null,
	currentPath: string = "",
): void => {
	if (!registry) {
		registry = new OpenAPIRegistry();
	}

	currentPath = currentPath + "/" + routeTree.name;

	applyResource(registry, routeTree.resource, currentPath);

	for (const subRoute of routeTree.subRoutes) {
		generateOpenApiDocsFromRouteTreeWithPath(subRoute, registry, currentPath);
	}

	const generator = new OpenApiGeneratorV3(registry.definitions);
	const openapiObject = generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "My API",
			description: "This is the API",
		},
	});
	fs.mkdirSync("artifacts", { recursive: true });
	fs.writeFileSync("artifacts/openapi-schema", JSON.stringify(openapiObject), {
		flag: "w+",
	});
};
