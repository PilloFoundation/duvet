import { defineExpressEndpoint, z } from "../kint";

export default defineExpressEndpoint(
	{
		requestBody: {
			id: z.string(),
		},
		responseBody: {
			id: z.string().openapi({
				description: "The ID of the user.",
			}),
		},
	},
	(request, response, context) => {
		// Stub endpoint.
	},
);
