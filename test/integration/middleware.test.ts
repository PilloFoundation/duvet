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

const dudResponse = {
  body: null,
  status: 200,
};

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
          return dudResponse;
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

  test("Adding middleware creates a new independent instance", () => {
    const runMiddleware = jest.fn();
    const runEndpoint = jest.fn();
    const runEndpointWithMiddleware = jest.fn();

    const kint = Kint.new<{}>();

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

    endpoint.data.handler({} as KintRequest, {}, {});
    endpointWithMiddleware.data.handler({} as KintRequest, {}, {});

    expect(runEndpoint.mock.calls).toHaveLength(1);
    expect(runMiddleware.mock.calls).toHaveLength(1);
    expect(runEndpointWithMiddleware.mock.calls).toHaveLength(1);
  });

  test("The config from the endpoint definition is passed into the middleware", async () => {
    const runMiddlewareOne = jest.fn();
    const runMiddlewareTwo = jest.fn();

    const kint = Kint.new<{}>()
      .addMiddleware(
        buildTestMiddleware("mwOne", (config: string) => {
          runMiddlewareOne(config);
        }),
      )
      .addMiddleware(
        buildTestMiddleware(
          "mwTwo",
          (config: { fieldOne: string; fieldTwo: number }) => {
            runMiddlewareTwo(config);
          },
        ),
      );

    const endpointWithConfigOne = kint.defineEndpoint(
      {
        mwOne: "endpointOne",
        mwTwo: {
          fieldOne: "endpointOne",
          fieldTwo: 1,
        },
      },
      () => dudResponse,
    );

    const endpointWithConfigTwo = kint.defineEndpoint(
      {
        mwOne: "endpointTwo",
        mwTwo: {
          fieldOne: "endpointTwo",
          fieldTwo: 2,
        },
      },
      () => dudResponse,
    );

    endpointWithConfigOne.data.handler(
      {} as KintRequest,
      {},
      endpointWithConfigOne.data.config,
    );
    endpointWithConfigTwo.data.handler(
      {} as KintRequest,
      {},
      endpointWithConfigTwo.data.config,
    );

    expect(runMiddlewareOne.mock.calls).toEqual([
      ["endpointOne"],
      ["endpointTwo"],
    ]);
    expect(runMiddlewareTwo.mock.calls).toEqual([
      [{ fieldOne: "endpointOne", fieldTwo: 1 }],
      [{ fieldOne: "endpointTwo", fieldTwo: 2 }],
    ]);
  });
});
