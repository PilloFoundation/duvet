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
