import { Router } from "express";
import { KintEndpointBuilder } from "./endpoint-builder/KintEndpointBuilder";
import { KintBuilder } from "./models/KintBundle";
import { endpointTreeFromDirectory } from "./endpoint-tree/fs-builder/buildEndpointTreeFromDirectory";
import { toExpressRouter } from "./endpoint-tree/toExpressRouter";

/**
 * @returns An object containing a Kint instance and a function to build an Express router from a directory.
 */
export function createExpressKint<GlobalContext>(): KintBuilder<
  GlobalContext,
  Router
> {
  return {
    kint: KintEndpointBuilder.new<GlobalContext>(),
    build(directory: string, context: GlobalContext): Router {
      const endpointTree = endpointTreeFromDirectory(directory);

      const expressRouter = toExpressRouter(endpointTree, () => context);

      return expressRouter;
    },
  };
}
