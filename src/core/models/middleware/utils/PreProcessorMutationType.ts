import { PreProcessingMiddlewareTuple } from "../PreProcessingMiddlewareTuple";
import { TupleToIntersection } from "../../../../utils/types/TupleToIntersection";
import { ExtensionTypes } from "./ExtensionTypes";

export type PreProcessorsExtensionType<
  ConcretePreProcessingMiddlewareTuple extends PreProcessingMiddlewareTuple
> = TupleToIntersection<ExtensionTypes<ConcretePreProcessingMiddlewareTuple>>;
