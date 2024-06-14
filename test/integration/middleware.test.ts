import { KintRequest, KintResponse } from "../../src";
import { Kint } from "../../src/core/Kint";
import {
  Middleware,
  MiddlewareHandler,
} from "../../src/core/models/Middleware";

// eslint-disable-next-line jsdoc/require-jsdoc
function buildTestMiddleware<Name extends string, Context, Config>(
  name: Name,
  before: (config: Config) => Context | null = () => null,
  after: (res: KintResponse) => KintResponse = (res) => res,
): Middleware<Name, Context | null, Config> {
  const middlewareHandler: MiddlewareHandler<Context | null, Config> = (
    request,
    next,
    config,
  ): KintResponse => {
    const context = before(config);
    const result = next(context);
    return after(result);
  };

  return {
    name,
    handler: middlewareHandler,
  };
}

describe("Middleware Integration", () => {
  test("Middleware runs in the correct order", () => {
    type Events =
      | "first before"
      | "first after"
      | "second before"
      | "second after"
      | "handler";

    const events: Events[] = [];

    const endpoint = Kint.new<{}>()
      .addMiddleware(
        buildTestMiddleware<"first", void, {}>(
          "first",
          () => {
            events.push("first before");
          },
          (res) => {
            events.push("first after");
            return res;
          },
        ),
      )
      .addMiddleware(
        buildTestMiddleware<"second", void, {}>(
          "second",
          () => {
            events.push("second before");
          },
          (res) => {
            events.push("second after");
            return res;
          },
        ),
      )
      .defineEndpoint(
        {
          first: {},
          second: {},
        },
        () => {
          events.push("handler");
          return {
            body: null,
            status: 200,
          };
        },
      );

    endpoint.data.handler({} as KintRequest, {}, {});

    expect(events).toEqual([
      "second before",
      "first before",
      "handler",
      "first after",
      "second after",
    ]);
  });
});
