import { DuvetExport } from "../core/common/DuvetExport";

/**
 * Tests if a value is a DuvetExport.
 * @param test The value to test
 * @returns A boolean indicating if the value is a DuvetExport.
 */
export function isDuvetExport(test: unknown): test is DuvetExport<unknown> {
  if (typeof test !== "object") return false;
  if (test == null) return false;
  if (!("builtByDuvet" in test)) return false;
  return test.builtByDuvet === true;
}
