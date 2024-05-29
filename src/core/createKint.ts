import { Router } from "express";
import { Kint } from "./Kint";
import { RouteTreeNode } from "./route-builder/RouteTreeNode";
import { KintBuilder } from "./KintBundle";

export function createExpressKint<Context>(): KintBuilder<Context, Router> {
  return {
    kint: new Kint<Context, {}, {}, [], []>({}, [], []),
    build(directory: string, context: Context): Router {
      const routeTree = RouteTreeNode.fromDirectory(directory);

      // TODO: Move toExpressRouter to an external library or extension
      return routeTree.toExpressRouter(() => context);
    },
  };
}
