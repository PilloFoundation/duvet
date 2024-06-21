import { DuvetEndpoint } from "../core/models/DuvetEndpoint";

/**
 * Tests if a value is a DuvetEndpoint object
 * @param test The value to test
 * @returns A boolean indicating if the value is a DuvetEndpoint object
 */
export function isDuvetEndpoint(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: any,
): test is DuvetEndpoint<unknown, unknown> {
  return test?.exportType === "DuvetEndpoint";
}
