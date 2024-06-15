import { MaybeAsync } from "../../utils/types/MaybeAsync";
import { KintRequest } from "./KintRequest";
import { KintResponse } from "./KintResponse";

export type Handler<Context> = (
  request: KintRequest,
  context: Context,
) => MaybeAsync<KintResponse>;
