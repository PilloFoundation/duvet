import { tryFn } from "../../../src/utils/tryFn";

describe("tryFn", () => {
  test("Returns the result of the function", () => {
    const result = tryFn(() => 1);
    expect(result).toBe(1);
  });

  test("Returns the error if the function throws", () => {
    const error = new Error("error");
    const result = tryFn(() => {
      throw error;
    });
    expect(result).toBe(error);
  });
});
