import { Handler } from "./Handler";

export type KintEndpoint<Context, Config> = {
  exportType: "KintEndpoint";
  handler: Handler<Context>;
  config: Config;
};
