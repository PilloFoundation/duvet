import { Router } from "express";
import { Kint } from "./Kint";
import { RouteTreeNode } from "./route-builder/RouteTreeNode";
import { KintBuilder } from "./models/KintBundle";

export function createExpressKint<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GlobalContext
>(): KintBuilder<GlobalContext, Router> {
  return {
    kint: Kint.new<GlobalContext>(),
    build(directory: string, context: GlobalContext): Router {
      const routeTree = RouteTreeNode.fromDirectory(directory);

      // TODO: Move toExpressRouter to an external library or extension
      return routeTree.toExpressRouter(() => context);
    },
  };
}
