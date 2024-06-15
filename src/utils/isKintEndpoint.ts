import { KintExport } from "../core/models/KintExport";

/**
 * Tests if a value is a KintExport.
 * @param test The value to test
 * @returns A boolean indicating if the value is a KintExport.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKintExport(test: any): test is KintExport<unknown> {
  return test?.builtByKint === true;
}
