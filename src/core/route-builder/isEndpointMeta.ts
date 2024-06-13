import { KintEndpointMeta } from "../models/KintEndpointMeta";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKintEndpointMeta(test: any): test is KintEndpointMeta {
  return test?.data === "KintEndpointMeta";
}
