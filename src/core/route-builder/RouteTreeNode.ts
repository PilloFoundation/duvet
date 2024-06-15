import fs from "fs";
import path from "path";
import { Router } from "express";
import { Method, Resource } from "../models/Resource";
import { isKintExport } from "./isKintEndpoint";
import { tryFn } from "../../utils/tryFn";
import { expressHandlerFromEndpointDefinition } from "./expressHandlerFromEndpoint";
import { isKintEndpointMeta } from "./isEndpointMeta";

// TODO: Refactor to not depend on express
export class RouteTreeNode<Context> {
  public subRoutes: RouteTreeNode<Context>[] = [];

  constructor(
    public name: string,
    public isUrlParam: boolean,
    private parent?: RouteTreeNode<Context>,
    public resource: Resource = {},
  ) {}

  /**
   * Populates a route tree node with the contents from a directory.
   * @param rootDirectory - The path to the routes directory.
   * @param relativePathToRoute - The relative path from the base directory to the current route.
   */
  private populateWithDirectoryContents(
    rootDirectory: string,
    relativePathToRoute: string,
  ) {
    const pathToCurrentRoute = path.join(rootDirectory, relativePathToRoute);

    const directoryContents = fs.readdirSync(pathToCurrentRoute);

    for (const currentFileName of directoryContents) {
      // Get the path to the current file from the routes base directory
      const relativePathToCurrentFile = path.join(
        relativePathToRoute,
        currentFileName,
      );
      const absolutePathToCurrentFile = path.join(
        rootDirectory,
        relativePathToCurrentFile,
      );

      const stat = fs.statSync(absolutePathToCurrentFile);

      if (stat.isDirectory()) {
        // Current file is a directory
        const newRouteTreeNode = this.createSubRoute(currentFileName);

        // Recursively populate the new route tree node
        newRouteTreeNode.populateWithDirectoryContents(
          rootDirectory,
          relativePathToCurrentFile,
        );

        // Add the new route tree node to the sub routes
        this.subRoutes.push(newRouteTreeNode);
      } else {
        // Current file is not a directory
        const httpMethodRegExp = /^(PUT|POST|GET|DELETE|PATCH)\.(ts|js)$/;

        // Check if it's a method file
        const methodMatch = currentFileName.match(httpMethodRegExp);

        if (methodMatch) {
          // eslint-disable-next-line no-type-assertion/no-type-assertion -- We know that methodMatch[1] is a Method because of the regex
          const method = methodMatch[1] as Method;

          const fullPath = path.parse(absolutePathToCurrentFile);
          const moduleName = path.join(fullPath.dir, fullPath.name);

          const module = tryFn(() => require(moduleName));

          if (module instanceof Error) {
            throw new Error(
              `Error while loading module at ${moduleName}: ${module.message}`,
            );
          }

          const kintExport = module?.default;

          // Check if the endpoint is a Kint endpoint
          if (isKintExport(kintExport) !== true) {
            throw new Error(
              `Endpoint at route ${relativePathToCurrentFile} is not a Kint endpoint`,
            );
          }

          const endpoint = kintExport.data;

          if (isKintEndpointMeta(endpoint) !== true) {
            throw new Error(
              `Endpoint at route ${relativePathToCurrentFile} is not a Kint endpoint`,
            );
          }

          this.resource[method] = endpoint;
        }
      }
    }
  }

  private createSubRoute(directoryName: string): RouteTreeNode<Context> {
    // Check if it's a url param
    const urlParamRegExp = /^\[(\w+)\]$/;
    const result = directoryName.match(urlParamRegExp);
    const isUrlParam = result !== null;
    const routeName = isUrlParam ? result[1] : directoryName;

    const route = new RouteTreeNode(routeName, isUrlParam, this);

    return route;
  }

  public static fromDirectory<C>(directory: string): RouteTreeNode<C> {
    const routeTree = new RouteTreeNode("root", false);

    routeTree.populateWithDirectoryContents(directory, "./");

    return routeTree;
  }

  public toExpressRouter(getContext: () => Context, currentPath: string = "") {
    const expressRouter = Router({
      mergeParams: true,
    });

    this.applyResource(expressRouter, this.resource, getContext);

    for (const subRoute of this.subRoutes) {
      const subRouter = subRoute.toExpressRouter(
        getContext,
        currentPath + "/" + subRoute.name,
      );

      const routePath = "/" + (subRoute.isUrlParam ? ":" : "") + subRoute.name;

      expressRouter.use(routePath, subRouter);
    }

    return expressRouter;
  }

  private applyResource<C>(
    router: Router,
    resource: Resource,
    getContext: () => C,
  ) {
    const { GET, POST, PATCH, DELETE, PUT } = resource;

    GET &&
      router.get("/", expressHandlerFromEndpointDefinition(GET, getContext));
    PUT &&
      router.put("/", expressHandlerFromEndpointDefinition(PUT, getContext));
    POST &&
      router.post("/", expressHandlerFromEndpointDefinition(POST, getContext));
    PATCH &&
      router.patch(
        "/",
        expressHandlerFromEndpointDefinition(PATCH, getContext),
      );
    DELETE &&
      router.delete(
        "/",
        expressHandlerFromEndpointDefinition(DELETE, getContext),
      );
  }
}
