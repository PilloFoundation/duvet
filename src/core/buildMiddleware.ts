import { KintRequest } from "./models/KintRequest";
import { KintResponse } from "./models/KintResponse";
import { PostProcessingMiddleware } from "./models/middleware/PostProcessingMiddleware";
import { PreProcessingMiddleware } from "./models/middleware/PreProcessingMiddleware";

export function buildPreProcessingMiddleware<
  Config extends object,
  RequestExtension extends object = {}
>(
  preProcess: (
    request: KintRequest,
    config: Config
  ) => RequestExtension | KintResponse | void
): PreProcessingMiddleware<Config, RequestExtension> {
  return {
    preProcess,
  };
}
