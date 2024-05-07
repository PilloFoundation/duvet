import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Plugin } from "..";
import { KintBuilder } from "../../kint";

export const kintOpenApiGenerator = <T>(): Plugin<T> => ({
	extend: (kintBuilder: KintBuilder<T>) => {
		extendZodWithOpenApi(kintBuilder.z);
	},
});
