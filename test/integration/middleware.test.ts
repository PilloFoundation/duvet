import { KintRequest } from "../../src";
import { Kint } from "../../src/core/Kint";
import { buildTestMiddleware } from "./buildTestMiddleware";
import { dudResponse } from "./dudResponse";

describe("Middleware Integration", () => {
  test("Middleware runs in the correct order", () => {
    type Events =
      | "first before"
      | "first after"
      | "second before"
      | "second after"
      | "handler";

    const events: Events[] = [];

    const endpoint = Kint.new<object>()
      .addMiddleware(
        buildTestMiddleware<"first", void, object>(
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
        buildTestMiddleware<"second", void, object>(
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
          return dudResponse;
        },
      );

    endpoint.data.handler({} as KintRequest, { global: {} });

    expect(events).toEqual([
      "second before",
      "first before",
      "handler",
      "first after",
      "second after",
    ]);
  });

  test("Adding middleware creates a new independent instance", () => {
    const runMiddleware = jest.fn();
    const runEndpoint = jest.fn();
    const runEndpointWithMiddleware = jest.fn();

    const kint = Kint.new<object>();

    const withMiddleware = kint.addMiddleware({
      handler: (req, next) => {
        runMiddleware();
        return next();
      },
      name: "test",
    });

    const endpoint = kint.defineEndpoint({}, () => {
      runEndpoint();
      return dudResponse;
    });

    const endpointWithMiddleware = withMiddleware.defineEndpoint({}, () => {
      runEndpointWithMiddleware();
      return dudResponse;
    });

    endpoint.data.handler({} as KintRequest, { global: {} });
    endpointWithMiddleware.data.handler({} as KintRequest, { global: {} });

    expect(runEndpoint.mock.calls).toHaveLength(1);
    expect(runMiddleware.mock.calls).toHaveLength(1);
    expect(runEndpointWithMiddleware.mock.calls).toHaveLength(1);
  });
});
