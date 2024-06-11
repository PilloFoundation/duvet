import { KintRequest } from "./KintRequest";
import { PostProcessingMiddlewareTuple } from "./middleware/PostProcessingMiddlewareTuple";
import { PreProcessingMiddlewareTuple } from "./middleware/PreProcessingMiddlewareTuple";
import { PreProcessorsExtensionType } from "./middleware/utils/PreProcessorMutationType";
import { HandlerOutput } from "../Kint";

export type Endpoint<
  Context,
  Config,
  PreProcessors extends PreProcessingMiddlewareTuple,
  PostProcessors extends PostProcessingMiddlewareTuple
> = {
  builtByKint: true;
  preProcessors: PreProcessors;
  postProcessors: PostProcessors;
  config: Config;
  handler: (
    request: PreProcessorsExtensionType<PreProcessors> & KintRequest,
    context: Context,
    config: Config
  ) => HandlerOutput<PostProcessors>;
};
