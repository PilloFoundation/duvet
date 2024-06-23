import { tryRun } from "../../src/utils/tryRun";

describe("tryFn", () => {
  test("Returns the result of the function", () => {
    const result = tryRun(() => 1);
    expect(result).toBe(1);
  });

  test("Returns the error if the function throws", () => {
    const error = new Error("error");
    const result = tryRun(() => {
      throw error;
    });
    expect(result).toBe(error);
  });

  test("Returns an error if the function throws a non-error", () => {
    const result = tryRun(() => {
      throw "error";
    });
    expect(result).toBeInstanceOf(Error);
  });
});
