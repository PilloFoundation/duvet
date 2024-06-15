import { KintEndpointMeta } from "../models/KintEndpointMeta";

/**
 * Tests if a value is a KintEndpointMeta object
 * @param test The value to test
 * @returns A boolean indicating if the value is a KintEndpointMeta object
 */
export function isKintEndpointMeta(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: any,
): test is KintEndpointMeta<unknown, unknown> {
  return test?.data === "KintEndpointMeta";
}
