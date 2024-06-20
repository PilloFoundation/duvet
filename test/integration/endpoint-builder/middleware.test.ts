import { KintRequest } from "../../../src";
import { KintEndpointBuilder } from "../../../src/core/endpoint-builder/KintEndpointBuilder";
import { buildTestMiddleware } from "../../helpers/buildTestMiddleware";
import { dudResponse } from "../dudResponse";

describe("Middleware Integration", () => {
  test("Middleware runs in the correct order", () => {
    type Events =
      | "first before"
      | "first after"
      | "second before"
      | "second after"
      | "handler";

    const events: Events[] = [];

    const endpoint = KintEndpointBuilder.new<object>()
      .addMiddleware(
        buildTestMiddleware(
          "first",
          () => {
            events.push("first before");
          },
          (response) => {
            events.push("first after");
            return response;
          },
        ),
      )
      .addMiddleware(
        buildTestMiddleware(
          "second",
          () => {
            events.push("second before");
          },
          (response) => {
            events.push("second after");
            return response;
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

    const kint = KintEndpointBuilder.new<object>();

    const withMiddleware = kint.addMiddleware({
      handler: (request, next) => {
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
