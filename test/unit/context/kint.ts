import kint from "../../../src/index";

export interface Context {
	a: string;
	b: number;
}

export const { buildRouter, defineExpressEndpoint } = kint<Context>();
