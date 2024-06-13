import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { KintResponse } from "../models/KintResponse";
import { KintRequest } from "../models/KintRequest";
import { KintEndpointMeta } from "../models/KintEndpointMeta";

// TODO: Refactor to use express adapters
export function expressHandlerFromEndpointDefinition<Context>(
  endpointMeta: KintEndpointMeta,
  getContext: () => Context
) {
  return async function expressHandler(
    request: ExpressRequest,
    response: ExpressResponse
  ) {
    const kintRequest: KintRequest = {
      underlying: request,
      response: {
        send(status: number, body: unknown) {
          throw new KintResponse(body, status);
        },
      },
    };

    const kintResponse = await endpointMeta.handler(
      kintRequest,
      { global: getContext() },
      endpointMeta.config
    );

    response.status(kintResponse.status).send(kintResponse.body);
  };
}
