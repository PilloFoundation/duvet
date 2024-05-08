import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { Plugin } from "..";
import { KintBuilder } from "../../kint";
import { generateOpenApiDocsFromRouteTreeWithPath } from "./generateOpenApiDocsFromRouteTree";

extendZodWithOpenApi(z);

export const kintOpenApiGenerator = <T>(): Plugin<T> => ({
	preBuild: (routeTree) => {
		generateOpenApiDocsFromRouteTreeWithPath(routeTree);
	},
	extend: (kintBuilder: KintBuilder<T>) => {
		kintBuilder.z = z;
	},
});

export { z };
