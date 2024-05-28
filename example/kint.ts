import { createKint } from '../src/core/createKint';
import { RawKintRequest } from '../src/models/RawKintRequest';
import { PreprocessingMiddleware } from '../src/middleware/models/PreprocessingMiddleware';

type Context = {
	a: string;
	b: number;
};

const kint = createKint<Context>();

type Role = 'admin' | 'user';

function auth(): PreprocessingMiddleware<
	{ auth: Role[] },
	RawKintRequest & { permissions: string[] }
> {
	return {
		defaultConfig: {
			auth: ['admin'],
		},
		preProcess: (request, config) => {
			return { ...request, permissions: ['insert'] };
		},
	};
}

const newKint = kint.preprocessingMiddleware(auth());

newKint.defineEndpoint(
	{
		auth: ['admin'],
	},
	(request, context, config) => {
		request.permissions;
	}
);
