import { buildMiddleware } from "../../../src/core/buildMiddleware";
import { DuvetRequest } from "../../../src/core/models/DuvetRequest";
import { DuvetResponse } from "../../../src/core/models/DuvetResponse";

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

    middleware.handler({} as DuvetRequest, (context: unknown) => {
      expect(context).toBe("context");
      return {} as DuvetResponse;
    });

    expect(doThing.mock.calls).toHaveLength(1);
  });
});
