import { z } from 'zod';
import { defineExpressEndpoint } from '../kint';

export default defineExpressEndpoint(
	{
		requestBody: z.object({
			foo: z.string(),
		}),
		responseBody: z.object({
			bar: z.string().default('baz'),
		}),
	},
	(request, response, context) => {
		// Stub endpoint.
		const { foo } = request.body;

		response.json({
			bar: 'baz',
		});

		response.json({});
	}
);
