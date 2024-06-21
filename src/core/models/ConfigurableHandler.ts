import { MaybeAsync } from "../../utils/types/MaybeAsync";
import { DuvetRequest } from "./DuvetRequest";
import { DuvetResponse } from "./DuvetResponse";

export type ConfigurableHandler<Context, Config> = (
  request: DuvetRequest,
  context: Context,
  config: Config,
) => MaybeAsync<DuvetResponse>;
