import kint from "../../../../src/index";
import { kintOpenApiGenerator } from "../../../../src/plugins/kintOpenApiGenerator";

export const { buildExpressRouter, defineExpressEndpoint, z } = kint<"context">(
	{
		plugins: [kintOpenApiGenerator()],
	},
);
