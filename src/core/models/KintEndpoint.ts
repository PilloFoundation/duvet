import { Handler } from "./Handler";

export type KintEndpoint<GlobalContext, Config> = {
  exportType: "KintEndpoint";
  handler: Handler<{ global: GlobalContext }>;
  config: Config;
};
