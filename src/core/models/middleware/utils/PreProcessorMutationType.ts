import { PreprocessingMiddlewareTuple } from "../PreprocessingMiddlewareTuple";
import { TupleToIntersection } from "../../../../utils/types/TupleToIntersection";
import { ExtensionTypes } from "./ExtensionTypes";

export type PreProcessorsExtensionType<
  ConcretePreProcessingMiddlewareTuple extends PreprocessingMiddlewareTuple
> = TupleToIntersection<ExtensionTypes<ConcretePreProcessingMiddlewareTuple>>;