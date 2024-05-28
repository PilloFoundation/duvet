import { Request, Response } from "express";
import { Endpoint } from "../models/Endpoint";
import { PreprocessingMiddlewareTuple } from "../models/middleware/PreprocessingMiddlewareTuple";
import { PostProcessingMiddlewareTuple } from "../models/middleware/PostProcessingMiddlewareTuple";
import { KintResponse } from "../models/KintResponse";
import { KintRequest } from "../models/KintRequest";
import { TupleToIntersection } from "../../utils/types/TupleToIntersection";
import { ExtensionTypes } from "../models/middleware/utils/ExtensionTypes";

export function expressHandlerFromEndpointDefinition<
  Context,
  Config,
  PreProcessors extends PreprocessingMiddlewareTuple,
  PostProcessors extends PostProcessingMiddlewareTuple
>(
  endpoint: Endpoint<Context, Config, PreProcessors, PostProcessors>,
  context: () => Context
) {
  return async function handler(request: Request, response: Response) {
    try {
      // Catches any errors thrown by the pre processors, endpoint handler or post processors

      try {
        // Catches errors solely from pre processors or endpoint handler
        let inputObject = { underlyingExpressRequest: request };

        // Iterate through pre processors and apply them to the input object
        for (const preProcessor of endpoint.preProcessors) {
          // Run preprocessor
          const result = await preProcessor.preProcess(
            { underlyingExpressRequest: request },
            endpoint.config
          );

          // If the result is a KintResponse, throw it
          if (result instanceof KintResponse) {
            throw result;
          } else if (typeof result === "object") {
            inputObject = { ...inputObject, ...result };
          }
        }

        // Run the endpoint handler
        const result = await endpoint.handler(
          inputObject as KintRequest &
            TupleToIntersection<ExtensionTypes<PreProcessors>>,
          context(),
          endpoint.config
        );

        // Throws the result to be caught by some handler. returns and throws are indistinguishable in kint.
        throw result;
      } catch (obj) {
        // Iterate through post processors
        for (const postProcessor of endpoint.postProcessors) {
          // Test if the thrown object should be caught by the post processor
          if (postProcessor.matcher(obj)) {
            // Rethrow the result of the post processor to be caught by kint.
            throw await postProcessor.handler(
              obj,
              { underlyingExpressRequest: request },
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
        response.status(500).send("Internal server error");
        return;
      }
    }
  };
}
