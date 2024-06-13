import { MaybeAsync } from "../../utils/types/MaybeAsync";
import { KintRequest } from "./KintRequest";
import { KintResponse } from "./KintResponse";

export type Handler<Context, Config> = (
  request: KintRequest,
  context: Context,
  config: Config
) => MaybeAsync<KintResponse>;
