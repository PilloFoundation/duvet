// TODO: Maybe restructure so we don't have to import from implementation of RouteTreeNode
import { RouteTreeNode } from "../RouteTreeNode";
import { type Express } from "express";

export interface GenericRouterBuilder<Context, Router> {
  build: (rootNode: RouteTreeNode<Context>, context: Context, app: Router) => Router;
}
