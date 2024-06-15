import { Handler } from "./Handler";

export type KintEndpoint<Context, Config> = {
  data: "KintEndpoint";
  handler: Handler<Context>;
  config: Config;
};
