import { Handler } from "./Handler";

export type DuvetEndpoint<GlobalContext, Config> = {
  exportType: "DuvetEndpoint";
  handler: Handler<{ global: GlobalContext }>;
  config: Config;
};
