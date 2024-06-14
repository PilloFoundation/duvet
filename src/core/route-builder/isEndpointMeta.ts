import { KintEndpointMeta } from "../models/KintEndpointMeta";

/**
 * Tests if a value is a KintEndpointMeta object
 * @param test The value to test
 * @returns A boolean indicating if the value is a KintEndpointMeta object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKintEndpointMeta(test: any): test is KintEndpointMeta {
  return test?.data === "KintEndpointMeta";
}
