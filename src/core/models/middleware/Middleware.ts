import { object } from "zod";
import { KintRequest } from "../KintRequest";
import { PostProcessingMiddleware } from "./PostProcessingMiddleware";
import { PreProcessingMiddleware } from "./PreProcessingMiddleware";

export type Middleware<
  Config extends object,
  RequestExtension extends object,
  CatchType extends object
> = PostProcessingMiddleware<Config, CatchType> &
  PreProcessingMiddleware<Config, RequestExtension>;
