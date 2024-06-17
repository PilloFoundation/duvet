import { KintEndpoint } from "../core/models/KintEndpoint";

/**
 * Tests if a value is a KintEndpoint object
 * @param test The value to test
 * @returns A boolean indicating if the value is a KintEndpoint object
 */
export function isKintEndpoint(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: any,
): test is KintEndpoint<unknown, unknown> {
  return test?.exportType === "KintEndpoint";
}
