import { KintExport } from "../models/KintExport";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKintExport(test: any): test is KintExport<unknown> {
  return test?.builtByKint === true;
}
