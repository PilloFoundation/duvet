import { KintEndpointBuilder, KintRequest } from "../../../src";
import { buildTestMiddleware } from "../../helpers/buildTestMiddleware";
import { dudResponse } from "../dudResponse";

function configTestMiddleware<Config>() {
  const runMiddleware = jest.fn();

  const middleware = buildTestMiddleware("testOne", (config: Config) => {
    runMiddleware(config);
  });

  return {
    middleware,
    runMiddleware,
  };
}

describe("Kint config", () => {
  test("Default config will used when no config provided", () => {
    const { middleware, runMiddleware } = configTestMiddleware<{
      a: string;
      b: number;
    }>();

    const kint = KintEndpointBuilder.new<object>().addMiddleware(middleware);

    const kintWithDefaultConfig = kint.setConfig({
      testOne: {
        a: "default",
        b: 10,
      },
    });

    const endpoint = kintWithDefaultConfig.defineEndpoint(
      {},
      () => dudResponse,
    );

    endpoint.data.handler({} as KintRequest, { global: {} });

    expect(runMiddleware.mock.calls[0][0]).toMatchObject({
      a: "default",
      b: 10,
    });
  });

  test("Configs from different endpoints passed to middleware", async () => {
    const runMiddlewareOne = jest.fn();
    const runMiddlewareTwo = jest.fn();

    const endpointBuilder = KintEndpointBuilder.new<object>()
      .addMiddleware(
        buildTestMiddleware("middlewareOne", (config: string) => {
          runMiddlewareOne(config);
        }),
      )
      .addMiddleware(
        buildTestMiddleware(
          "middlewareTwo",
          (config: { fieldOne: string; fieldTwo: number }) => {
            runMiddlewareTwo(config);
          },
        ),
      );

    const endpointBuilderWithConfigOne = endpointBuilder.defineEndpoint(
      {
        middlewareOne: "endpointOne",
        middlewareTwo: {
          fieldOne: "endpointOne",
          fieldTwo: 1,
        },
      },
      () => dudResponse,
    );

    const endpointBuilderWithConfigTwo = endpointBuilder.defineEndpoint(
      {
        middlewareOne: "endpointTwo",
        middlewareTwo: {
          fieldOne: "endpointTwo",
          fieldTwo: 2,
        },
      },
      () => dudResponse,
    );

    endpointBuilderWithConfigOne.data.handler({} as KintRequest, {
      global: {},
    });
    endpointBuilderWithConfigTwo.data.handler({} as KintRequest, {
      global: {},
    });

    expect(runMiddlewareOne.mock.calls).toEqual([
      ["endpointOne"],
      ["endpointTwo"],
    ]);
    expect(runMiddlewareTwo.mock.calls).toEqual([
      [{ fieldOne: "endpointOne", fieldTwo: 1 }],
      [{ fieldOne: "endpointTwo", fieldTwo: 2 }],
    ]);
  });

  test("Extending config creates a new Kint instance", () => {
    const { middleware, runMiddleware } = configTestMiddleware<{
      a: string;
      b: number;
    }>();

    const kint = KintEndpointBuilder.new<object>().addMiddleware(middleware);
    const kintWithExtendedConfigOne = kint.extendConfig({
      testOne: { a: "extendOne", b: 1 },
    });
    const kintWithExtendedConfigTwo = kint.extendConfig({
      testOne: { a: "extendTwo", b: 2 },
    });

    const endpointWithNoExtension = kint.defineEndpoint(
      {
        testOne: { a: "noExtend", b: 0 },
      },
      () => dudResponse,
    );
    const endpointWithExtendedConfigOne =
      kintWithExtendedConfigOne.defineEndpoint({}, () => dudResponse);
    const endpointWithExtendedConfigTwo =
      kintWithExtendedConfigTwo.defineEndpoint({}, () => dudResponse);

    endpointWithNoExtension.data.handler({} as KintRequest, { global: {} });
    endpointWithExtendedConfigOne.data.handler({} as KintRequest, {
      global: {},
    });
    endpointWithExtendedConfigTwo.data.handler({} as KintRequest, {
      global: {},
    });

    expect(runMiddleware.mock.calls).toHaveLength(3);
    expect(runMiddleware.mock.calls).toMatchObject([
      [
        {
          a: "noExtend",
          b: 0,
        },
      ],
      [
        {
          a: "extendOne",
          b: 1,
        },
      ],
      [
        {
          a: "extendTwo",
          b: 2,
        },
      ],
    ]);
  });
});
