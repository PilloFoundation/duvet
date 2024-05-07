import { RouteTreeNode } from "../RouteTreeNode";
import { KintBuilder } from "../kint";

export type Plugin<T> = {
	preBuild?: (routeTree: RouteTreeNode<unknown>) => void;
    extend?: (builder: KintBuilder<T>) => void;
};
