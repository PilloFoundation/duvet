import { Request, Response } from "express";
import { Endpoint } from "../models/Endpoint";
import { PreProcessingMiddlewareTuple } from "../models/middleware/PreProcessingMiddlewareTuple";
import { PostProcessingMiddlewareTuple } from "../models/middleware/PostProcessingMiddlewareTuple";
import { KintResponse } from "../models/KintResponse";
import { KintRequest } from "../models/KintRequest";
import { PreProcessorsExtensionType } from "../models/middleware/utils/PreProcessorMutationType";

// TODO: Refactor to use express adapters
export function expressHandlerFromEndpointDefinition<
  Context,
  Config,
  PreProcessors extends PreProcessingMiddlewareTuple,
  PostProcessors extends PostProcessingMiddlewareTuple
>(
  endpoint: Endpoint<Context, Config, PreProcessors, PostProcessors>,
  getContext: () => Context
) {
  return async function handler(request: Request, response: Response) {
    const kintRequest: KintRequest = {
      underlying: request,
      response: {
        send(status: number, body: any) {
          throw new KintResponse(body, status);
        },
      },
    };

    try {
      // Catches any errors thrown by the pre processors, endpoint handler or post processors

      try {
        // Catches errors solely from pre processors or endpoint handler
        let inputObject = kintRequest;

        // Iterate through pre processors and apply them to the input object
        for (const preProcessor of endpoint.preProcessors) {
          // Run preprocessor
          const result = await preProcessor.preProcess(
            kintRequest,
            endpoint.config
          );

          // TODO: Instead of merging results, just let the preprocessor modify the existing object and hold a contract that the output type will be the input type + the new merge type

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
            PreProcessorsExtensionType<PreProcessors>,
          getContext(),
          endpoint.config
        );

        // Throws the result to be caught by some handler returns and throws are indistinguishable in kint.
        // TODO: If the result is a KintResponse just handle it and return
        throw result;
      } catch (obj) {
        // Iterate through post processors
        for (const postProcessor of endpoint.postProcessors) {
          // Test if the thrown object should be handled by the post processor
          if (postProcessor.matcher(obj)) {
            // Rethrow the result of the post processor to be caught by kint.
            throw await postProcessor.handler(
              obj,
              kintRequest,
              endpoint.config
            );
          }
        }

        // Not handled by any post processors, rethrow
        throw obj;
      }
    } catch (obj) {
      if (obj instanceof KintResponse) {
        response.status(obj.status).send(obj.body);
        return;
      } else if (obj instanceof Error) {
        response.status(500).send(obj.message);
        return;
      } else if (obj == null) {
        response.status(500).send("Endpoint did not send a response");
      } else {
        response.status(500).send("Internal server error");
        return;
      }
    }
  };
}
