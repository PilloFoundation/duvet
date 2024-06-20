import { DuvetRequest } from "../../../src";
import { DuvetEndpointBuilder } from "../../../src/core/endpoint-builder/DuvetEndpointBuilder";
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

    const endpoint = DuvetEndpointBuilder.new<object>()
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

    endpoint.data.handler({} as DuvetRequest, { global: {} });

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

    const duvet = DuvetEndpointBuilder.new<object>();

    const withMiddleware = duvet.addMiddleware({
      handler: (request, next) => {
        runMiddleware();
        return next();
      },
      name: "test",
    });

    const endpoint = duvet.defineEndpoint({}, () => {
      runEndpoint();
      return dudResponse;
    });

    const endpointWithMiddleware = withMiddleware.defineEndpoint({}, () => {
      runEndpointWithMiddleware();
      return dudResponse;
    });

    endpoint.data.handler({} as DuvetRequest, { global: {} });
    endpointWithMiddleware.data.handler({} as DuvetRequest, { global: {} });

    expect(runEndpoint.mock.calls).toHaveLength(1);
    expect(runMiddleware.mock.calls).toHaveLength(1);
    expect(runEndpointWithMiddleware.mock.calls).toHaveLength(1);
  });
});
