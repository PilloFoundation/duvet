import { KintRequest } from "./KintRequest";
import { KintResponse } from "./KintResponse";

export type Middleware<Name extends string, Context, Config> = {
  handler: (
    request: KintRequest,
    config: Config,
    next: (contextExtension: Context) => KintResponse
  ) => KintResponse;
  name: Name;
};
