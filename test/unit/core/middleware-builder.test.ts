import { buildMiddleware } from "../../../src/core/buildMiddleware";
import { KintRequest } from "../../../src/core/models/KintRequest";
import { KintResponse } from "../../../src/core/models/KintResponse";

describe("Middleware Builder", () => {
  test("Builds a middleware object correctly", () => {
    const doThing = jest.fn(() => {});

    const middleware = buildMiddleware<"test", void, "context", void>(
      "test",
      (request, next) => {
        doThing();
        return next("context");
      },
    );

    expect(middleware.name).toBe("test");
    expect(middleware.handler).toBeDefined();

    middleware.handler({} as KintRequest, (context: unknown) => {
      expect(context).toBe("context");
      return {} as KintResponse;
    });

    expect(doThing.mock.calls).toHaveLength(1);
  });
});
