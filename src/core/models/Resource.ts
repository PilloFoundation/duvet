import { KintExport } from "./KintExport";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Resource<C> = {
  [method in Method]?: KintExport<C, any, any, any>;
};
