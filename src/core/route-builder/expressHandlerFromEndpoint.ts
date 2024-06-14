import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { KintResponse } from "../models/KintResponse";
import { KintRequest } from "../models/KintRequest";
import { KintEndpointMeta } from "../models/KintEndpointMeta";

/**
 * Takes an endpoint definition and context provider and returns an express handler which can be passed to any Express `use` directive (or equivalent).
 * @param endpointMeta The endpoint definition to create a handler for.
 * @param getContext A function which returns the context object to pass to the handler.
 * @returns An express handler function which can be passed to any Express `use` directive (or equivalent).
 */
// TODO: Refactor to use express adapters
export function expressHandlerFromEndpointDefinition<Context>(
  endpointMeta: KintEndpointMeta,
  getContext: () => Context,
) {
  return function expressHandler(
    request: ExpressRequest,
    response: ExpressResponse,
  ) {
    const kintRequest: KintRequest = {
      underlying: request,
      response: {
        send(status: number, body: unknown) {
          throw new KintResponse(body, status);
        },
      },
    };

    const kintResponse = endpointMeta.handler(
      kintRequest,
      { global: getContext() },
      endpointMeta.config,
    );

    if (kintResponse instanceof Promise) {
      kintResponse.then((kintResponse) => {
        response.status(kintResponse.status).send(kintResponse.body);
      });
    } else {
      response.status(kintResponse.status).send(kintResponse.body);
    }
  };
}
