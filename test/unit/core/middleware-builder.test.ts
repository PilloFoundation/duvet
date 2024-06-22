import { DuvetRequest } from "../../../src";
import { buildMiddleware } from "../../../src/core/buildMiddleware";
import { DuvetResponse } from "../../../src/core/models/DuvetResponse";

describe("Middleware Builder", () => {
  test("Builds a middleware object correctly", async () => {
    const doThing = jest.fn(() => {});

    const middleware = buildMiddleware<"test", null, "context", null>(
      "test",
      (request, next) => {
        doThing();
        return next("context");
      },
    );

    expect(middleware.name).toBe("test");
    expect(middleware.handler).toBeDefined();

    await middleware.handler(
      { config: null, global: null, request: {} as DuvetRequest },
      (context: unknown) => {
        expect(context).toBe("context");
        return {} as DuvetResponse;
      },
    );

    expect(doThing.mock.calls).toHaveLength(1);
  });
});
