import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
} from "express";
import { DuvetResponse } from "../models/DuvetResponse";
import { DuvetRequest } from "../models/DuvetRequest";
import { EndpointTreeNode } from "./EndpointTree";
import { Handler } from "../models/Handler";
import { Method } from "../models/Resource";

/**
 * Takes an endpoint definition and context provider and returns an express handler which can be passed to any Express `use` directive (or equivalent).
 * @param handler The endpoint definition to create a handler for.
 * @param getContext A function which returns the context object to pass to the handler.
 * @returns An express handler function which can be passed to any Express `use` directive (or equivalent).
 */
// TODO: Refactor to use express adapters
export function expressHandlerFromDuvetHandler<GlobalContext>(
  handler: Handler<{ global: GlobalContext }>,
  getContext: () => GlobalContext,
) {
  return function expressHandler(
    request: ExpressRequest,
    response: ExpressResponse,
  ) {
    const duvetRequest: DuvetRequest = {
      underlying: request,
      response: {
        send(status: number, body: unknown) {
          throw new DuvetResponse(body, status);
        },
      },
    };

    const duvetResponse = handler(duvetRequest, {
      global: getContext(),
    });

    if (duvetResponse instanceof Promise) {
      duvetResponse.then((duvetResponse) => {
        response.status(duvetResponse.status).send(duvetResponse.body);
      });
    } else {
      response.status(duvetResponse.status).send(duvetResponse.body);
    }
  };
}

/**
 * Takes an endpoint tree and converts it to an express router.
 * @param endpointTree The endpoint tree to convert
 * @param getContext A function which returns the context object to pass to the handler.
 * @param basePath The path for the router to be mounted at.
 * @returns An express router which can be mounted on an express app.
 */
export function toExpressRouter<Context, PluginConfig>(
  endpointTree: EndpointTreeNode<Context, PluginConfig>,
  getContext: () => Context,
  basePath: string = "",
) {
  const expressRouter = Router({
    mergeParams: true,
  });

  for (const ep of endpointTree.endpoints) {
    const handler = expressHandlerFromDuvetHandler(ep.handler, getContext);

    const methodAsLower = ep.method.toLowerCase() as Lowercase<Method>;

    expressRouter[methodAsLower]("/", handler);
  }

  for (const subRoute of endpointTree.subRoutes) {
    const subRouter = toExpressRouter(
      subRoute,
      getContext,
      basePath + "/" + subRoute.name,
    );

    const subRoutePath = "/" + (subRoute.isParam ? ":" : "") + subRoute.name;

    expressRouter.use(subRoutePath, subRouter);
  }

  return expressRouter;
}
