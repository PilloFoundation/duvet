import { KintRequest } from "./models/KintRequest";
import { KintResponse } from "./models/KintResponse";
import { PostProcessingMiddleware } from "./models/middleware/PostProcessingMiddleware";
import { PreprocessingMiddleware } from "./models/middleware/PreprocessingMiddleware";

export function buildPreprocessingMiddleware<
  Config extends object,
  RequestExtension extends object = {}
>(
  preProcess: (
    request: KintRequest,
    config: Config
  ) => RequestExtension | KintResponse | void
): PreprocessingMiddleware<Config, RequestExtension> {
  return {
    preProcess,
  };
}
