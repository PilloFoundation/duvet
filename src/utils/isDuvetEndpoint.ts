import { DuvetEndpoint } from "../core/endpoint-builder/DuvetEndpoint";

/**
 * Tests if a value is a DuvetEndpoint object
 * @param test The value to test
 * @returns A boolean indicating if the value is a DuvetEndpoint object
 */
export function isDuvetEndpoint(
  test: unknown,
): test is DuvetEndpoint<unknown, unknown, unknown, unknown> {
  if (typeof test !== "object") return false;
  if (test == null) return false;
  if (!("exportType" in test)) return false;

  return test.exportType === "DuvetEndpoint";
}
