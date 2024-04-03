import { z } from 'zod';
import makeEndpoint from '../../kint-test-app';

export default makeEndpoint(
	{
		urlParams: {
			test: z.string(),
		},
	},
	(req, res, ctx) => {}
);
