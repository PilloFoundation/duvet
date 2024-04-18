import { RouteTreeNode } from "../RouteTreeNode";
import { GenericRouterBuilder } from "../models/GenericRouterBuilder";
import express, { Router, type Express } from "express";
import { Resource } from "../models/Resource";
import { createHandlerFromEndpoint } from "../createHandlerFromEndpoint";

function applyExpressResource<Context>(
  router: Router,
  resource: Resource<Context>,
  getContext: () => Context
) {
  const { GET, POST, PATCH, DELETE, PUT } = resource;

  GET && router.get("/", createHandlerFromEndpoint(GET, getContext));
  PUT && router.put("/", createHandlerFromEndpoint(PUT, getContext));
  POST && router.post("/", createHandlerFromEndpoint(POST, getContext));
  PATCH && router.patch("/", createHandlerFromEndpoint(PATCH, getContext));
  DELETE && router.delete("/", createHandlerFromEndpoint(DELETE, getContext));
}

function toExpressRouter<Context>(
  rootNode: RouteTreeNode<Context>,
  getContext: () => Context,
  currentPath: string = ""
) {
  const expressRouter = Router({
    mergeParams: true,
  });

  applyExpressResource(expressRouter, rootNode.resource, getContext);

  for (const subRoute of rootNode.subRoutes) {
    const subRouter = toExpressRouter(
      subRoute,
      getContext,
      currentPath + "/" + subRoute.name
    );

    const routePath = "/" + (subRoute.isUrlParam ? ":" : "") + subRoute.name;

    expressRouter.use(routePath, subRouter);
  }

  return expressRouter;
}

export function expressRouterBuilder<Context>(): GenericRouterBuilder<
  Context,
  Express
> {
  return {
    build: (rootNode, context, app = express()) => {
      toExpressRouter(rootNode, () => context);

      app.use(express.json());
      app.use("/");

      return app;
    },
  };
}
