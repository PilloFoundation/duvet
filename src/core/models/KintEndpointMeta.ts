import { Handler } from "./Handler";

export type KintEndpointMeta<Context, Config> = {
  data: "KintEndpointMeta";
  handler: Handler<Context>;
  config: Config;
};
