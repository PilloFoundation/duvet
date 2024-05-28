import { Request, Response } from 'express';
import { Endpoint } from '../models/Endpoint';
import { PreprocessingMiddlewareTuple } from '../middleware/models/PreprocessingMiddlewareTuple';
import { PostProcessingMiddlewareTuple } from '../middleware/models/PostProcessingMiddlewareTuple';
import { KintResponse } from '../models/KintResponse';
import { KintRequest } from '../models/KintRequest';
import { TupleToIntersection } from '../utils/types/TupleToIntersection';
import { ExtensionTypes } from '../middleware/utils/ExtensionTypes';

export function expressHandlerFromEndpointDefinition<
	Context,
	Config,
	PreProcessors extends PreprocessingMiddlewareTuple,
	PostProcessors extends PostProcessingMiddlewareTuple
>(endpoint: Endpoint<Context, Config, PreProcessors, PostProcessors>) {
	return async function handler(
		request: Request,
		response: Response,
		context: Context
	) {
		try {
			// Catches any errors thrown by the pre processors, endpoint handler or post processors

			try {
				// Catches errors just by pre processors or endpoint handler

				let inputObject = { request };

				// Iterate through pre processors and apply them to the input object
				for (const preProcessor of endpoint.preProcessors) {
					// Run preprocessor
					const result = await preProcessor.preProcess(
						{ request },
						endpoint.config
					);

					// If the result is a KintResponse, throw it
					if (result instanceof KintResponse) {
						throw result;
					} else if (typeof result === 'object') {
						inputObject = { ...inputObject, ...result };
					}
				}

				// Run the endpoint handler
				const result = await endpoint.handler(
					inputObject as KintRequest &
						TupleToIntersection<ExtensionTypes<PreProcessors>>,
					context,
					endpoint.config
				);

				throw result;
			} catch (obj) {
				for (const postProcessor of endpoint.postProcessors) {
					if (postProcessor.matcher(obj)) {
						throw await postProcessor.handler(
							obj,
							{ request },
							endpoint.config
						);
					}
				}
			}
		} catch (obj) {
			if (obj instanceof KintResponse) {
				response.status(obj.status).send(obj.body);
				return;
			} else {
				response.status(500).send('Internal server error');
				return;
			}
		}
	};
}
