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
  test("Default config will used when no config provided", () => {
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

    endpoint.data.handler({} as DuvetRequest, { global: {} });

    expect(runMiddleware.mock.calls[0][0]).toMatchObject({
      a: "default",
      b: 10,
    });
  });

  test("Configs from different endpoints passed to middleware", async () => {
    const runMiddlewareOne = jest.fn();
    const runMiddlewareTwo = jest.fn();

    const eb = DuvetEndpointBuilder.new<object>()
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

    const ebWithConfigOne = eb.defineEndpoint(
      {
        mwOne: "endpointOne",
        mwTwo: {
          fieldOne: "endpointOne",
          fieldTwo: 1,
        },
      },
      () => dudResponse,
    );

    const ebWithConfigTwo = eb.defineEndpoint(
      {
        mwOne: "endpointTwo",
        mwTwo: {
          fieldOne: "endpointTwo",
          fieldTwo: 2,
        },
      },
      () => dudResponse,
    );

    ebWithConfigOne.data.handler({} as DuvetRequest, {
      global: {},
    });
    ebWithConfigTwo.data.handler({} as DuvetRequest, {
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

  test("Extending config creates a new Duvet instance", () => {
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

    endpointWithNoExtension.data.handler({} as DuvetRequest, { global: {} });
    endpointWithExtendedConfigOne.data.handler({} as DuvetRequest, {
      global: {},
    });
    endpointWithExtendedConfigTwo.data.handler({} as DuvetRequest, {
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
