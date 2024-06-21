import { DuvetExport } from "../core/models/DuvetExport";

/**
 * Tests if a value is a DuvetExport.
 * @param test The value to test
 * @returns A boolean indicating if the value is a DuvetExport.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDuvetExport(test: any): test is DuvetExport<unknown> {
  return test?.builtByDuvet === true;
}
