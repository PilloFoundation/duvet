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
          (res) => {
            events.push("first after");
            return res;
          },
        ),
      )
      .addMiddleware(
        buildTestMiddleware(
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
      handler: (req, next) => {
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
