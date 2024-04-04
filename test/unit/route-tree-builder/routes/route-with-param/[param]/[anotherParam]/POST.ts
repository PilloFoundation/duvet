import { z } from 'zod';
import makeEndpoint from '../../../../kint-test-app';

export default makeEndpoint(
	{
		urlParams: {
			param: z.string(),
			anotherParam: z.string(),
		},
	},
	(request, response, context) => {
		// Stub endpoint.
	}
);
