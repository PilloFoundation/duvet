// TODO: Maybe restructure so we don't have to import from implementation of RouteTreeNode
import { RouteTreeNode } from "../RouteTreeNode";

export interface AppBuilder<Context, Router> {
	build(
		rootNode: RouteTreeNode<Context>,
		context: Context,
		app?: Router,
	): Router;
}
