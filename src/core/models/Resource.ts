import { KintEndpointMeta } from "./KintEndpointMeta";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Resource = {
  [method in Method]?: KintEndpointMeta;
};
