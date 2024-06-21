import { Router } from "express";
import { DuvetEndpointBuilder } from "./endpoint-builder/DuvetEndpointBuilder";
import { DuvetBuilder } from "./models/DuvetBundle";
import { endpointTreeFromDirectory } from "./endpoint-tree/fs-builder/buildEndpointTreeFromDirectory";
import { toExpressRouter } from "./endpoint-tree/toExpressRouter";

/**
 * @returns An object containing a Duvet instance and a function to build an Express router from a directory.
 */
export function createExpressDuvet<GlobalContext>(): DuvetBuilder<
  GlobalContext,
  Router
> {
  return {
    duvet: DuvetEndpointBuilder.new<GlobalContext>(),
    build(directory: string, context: GlobalContext): Router {
      const endpointTree = endpointTreeFromDirectory(directory);
      const expressRouter = toExpressRouter(endpointTree, () => context);
      return expressRouter;
    },
  };
}
