import { DuvetEndpointBuilder, DuvetRequest } from "../../../src";
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

describe("Duvet config", () => {
  test("Default config will used when no config provided", async () => {
    const { middleware, runMiddleware } = configTestMiddleware<{
      a: string;
      b: number;
    }>();

    const duvet = DuvetEndpointBuilder.new<object>().addMiddleware(middleware);

    const duvetWithDefaultConfig = duvet.setConfig({
      testOne: {
        a: "default",
        b: 10,
      },
    });

    const endpoint = duvetWithDefaultConfig.defineEndpoint(
      {},
      () => dudResponse,
    );

    await endpoint.data.handler({} as DuvetRequest, { global: {} });

    expect(runMiddleware.mock.calls[0][0]).toMatchObject({
      a: "default",
      b: 10,
    });
  });

  test("Configs from different endpoints passed to middleware", async () => {
    const runMiddlewareOne = jest.fn();
    const runMiddlewareTwo = jest.fn();

    const endpointBuilder = DuvetEndpointBuilder.new<object>()
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

    await endpointBuilderWithConfigOne.data.handler({} as DuvetRequest, {
      global: {},
    });
    await endpointBuilderWithConfigTwo.data.handler({} as DuvetRequest, {
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

  test("Extending config creates a new Duvet instance", async () => {
    const { middleware, runMiddleware } = configTestMiddleware<{
      a: string;
      b: number;
    }>();

    const duvet = DuvetEndpointBuilder.new<object>().addMiddleware(middleware);
    const duvetWithExtendedConfigOne = duvet.extendConfig({
      testOne: { a: "extendOne", b: 1 },
    });
    const duvetWithExtendedConfigTwo = duvet.extendConfig({
      testOne: { a: "extendTwo", b: 2 },
    });

    const endpointWithNoExtension = duvet.defineEndpoint(
      {
        testOne: { a: "noExtend", b: 0 },
      },
      () => dudResponse,
    );
    const endpointWithExtendedConfigOne =
      duvetWithExtendedConfigOne.defineEndpoint({}, () => dudResponse);
    const endpointWithExtendedConfigTwo =
      duvetWithExtendedConfigTwo.defineEndpoint({}, () => dudResponse);

    await endpointWithNoExtension.data.handler({} as DuvetRequest, {
      global: {},
    });
    await endpointWithExtendedConfigOne.data.handler({} as DuvetRequest, {
      global: {},
    });
    await endpointWithExtendedConfigTwo.data.handler({} as DuvetRequest, {
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
