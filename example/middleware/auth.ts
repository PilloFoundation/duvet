import { PreprocessingMiddleware } from '../../src/core/models/middleware/PreprocessingMiddleware';

export type Role = 'admin' | 'user';

export function auth(): PreprocessingMiddleware<
	{ roles?: Role[] },
	{ permissions: string[] }
> {
	return {
		defaultConfig: {
			roles: ['admin'],
		},
		preProcess: (request, config) => {
			return { permissions: ['insert'] };
		},
	};
}
