import { Router, Request as ExpressRequest } from "express";
import { DuvetEndpointBuilder } from "../core/endpoint-builder/DuvetEndpointBuilder";
import { DuvetBuilder } from "../core/common/DuvetBuilder";
import { endpointTreeFromDirectory } from "../core/endpoint-tree/fs-builder/endpointTreeFromDirectory";
import { endpointTreeToExpressRouter } from "./endpointTreeToExpressRouter";
import { EndpointTreeNode } from "../core/endpoint-tree/EndpointTree";
import { ExpressResponseWrapper } from "./models/ExpressResponseWrapper";

type ExpressEndpointTreeNode<GlobalContext> = EndpointTreeNode<
  ExpressRequest,
  ExpressResponseWrapper,
  GlobalContext,
  unknown
>;

/**
 * @returns An object containing a Duvet instance and a function to build an Express router from a directory.
 */
export function createExpressDuvet<GlobalContext>(): DuvetBuilder<
  ExpressRequest,
  ExpressResponseWrapper,
  GlobalContext,
  Router
> {
  return {
    duvet: DuvetEndpointBuilder.new<
      GlobalContext,
      ExpressRequest,
      ExpressResponseWrapper
    >(),
    build(directory: string, context: GlobalContext): Router {
      const endpointTree = endpointTreeFromDirectory(directory);
      const expressRouter = endpointTreeToExpressRouter(
        // TODO: Create some sort of verification method for express endpoint tree types.
        // eslint-disable-next-line no-type-assertion/no-type-assertion
        endpointTree as ExpressEndpointTreeNode<GlobalContext>,
        () => context,
      );
      return expressRouter;
    },
  };
}
