import { Router } from "express";
import { KintEndpointBuilder } from "./KintEndpointBuilder";
import { RouteTreeNode } from "./route-builder/RouteTreeNode";
import { KintBuilder } from "./models/KintBundle";

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
      const routeTree = RouteTreeNode.fromDirectory(directory);

      // TODO: Move toExpressRouter to an external library or extension
      return routeTree.toExpressRouter(() => context);
    },
  };
}
