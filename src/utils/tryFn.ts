/**
 * Tries to run a function and returns the result or an error if the function throws an error.
 * @param run The function to run.
 * @returns Either the result of the function or an error.
 */
export function tryFn<T>(run: () => T): T | Error {
  try {
    return run();
  } catch (e) {
    if (e instanceof Error) {
      return e;
    } else {
      return new Error("An unknown error occurred :/");
    }
  }
}
