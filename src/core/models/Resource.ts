import { KintEndpoint } from "./KintEndpoint";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Resource = {
  [method in Method]?: KintEndpoint;
};
