import { RawKintRequest } from '../models/RawKintRequest';
import { Kint } from '../models/Kint/Kint';

export function createKint<Context>(): Kint<Context, {}, RawKintRequest, []> {
	return {
		userConfig: {},
		preProcessor: {
			preProcess: (request, config) => request,
		},
		postProcessors: [],
	};
}
