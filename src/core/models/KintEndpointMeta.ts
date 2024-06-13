/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handler } from "../Kint";

export type KintEndpointMeta = {
  data: "KintEndpointMeta";
  handler: Handler<any, any>;
  config: Record<string, unknown>;
};
