import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Plugin } from "..";
import { KintBuilder } from "../../kint";
import { generateOpenApiDocsFromRouteTreeWithPath } from "./generateOpenApiDocsFromRouteTree";

export const kintOpenApiGenerator = <T>(): Plugin<T> => ({
	preBuild: (routeTree) => {
		generateOpenApiDocsFromRouteTreeWithPath(routeTree);
	},
	extend: (kintBuilder: KintBuilder<T>) => {
		extendZodWithOpenApi(kintBuilder.z);
	},
});
