import { MaybeAsync } from "../../utils/types/MaybeAsync";
import { DuvetRequest } from "./DuvetRequest";
import { DuvetResponse } from "./DuvetResponse";

export type Handler<Context> = (
  request: DuvetRequest,
  context: Context,
) => MaybeAsync<DuvetResponse>;
