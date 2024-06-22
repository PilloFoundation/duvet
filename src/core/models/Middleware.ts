import { MaybeAsync } from "../../utils/types/MaybeAsync";
import { DuvetRequest } from "./DuvetRequest";
import { DuvetResponse } from "./DuvetResponse";

export type MiddlewareHandler<
  ConfigExtension,
  ContextExtension,
  GlobalContext = unknown,
> = (
  context: {
    request: DuvetRequest;
    config: ConfigExtension;
    global: GlobalContext;
  },
  next: (ext: ContextExtension) => MaybeAsync<DuvetResponse>,
) => MaybeAsync<DuvetResponse>;

export type Middleware<
  Name extends string,
  ConfigExtension = void,
  ContextExtension = void,
  GlobalContext = unknown,
> = {
  handler: MiddlewareHandler<ConfigExtension, ContextExtension, GlobalContext>;
  name: Name;
};
