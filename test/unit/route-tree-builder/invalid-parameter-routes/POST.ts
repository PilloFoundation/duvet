import { z } from 'zod';
import makeEndpoint from '../kint-test-app';

export default makeEndpoint(
	{
		urlParams: {
			doesNotExist: z.string(),
		},
	},
	(req, res, ctx) => {
		// Do nothing, should throw.
	}
);
