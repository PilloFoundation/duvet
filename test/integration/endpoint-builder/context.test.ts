import { KintRequest } from "../../../src";
import { KintEndpointBuilder } from "../../../src/core/endpoint-builder/KintEndpointBuilder";
import { buildTestMiddleware } from "../../helpers/buildTestMiddleware";

describe("Middleware context", () => {
  test("Middleware correctly extends context object", async () => {
    const runMiddleware = jest.fn();

    const kint = KintEndpointBuilder.new<object>()
      .addMiddleware(
        buildTestMiddleware("testOne", () => ({ a: "setA", b: 10 })),
      )
      .addMiddleware(buildTestMiddleware("testTwo", () => "setB"));

    const endpoint = kint.defineEndpoint({}, (request, context) => {
      runMiddleware();

      expect(context).toMatchObject({
        testOne: { a: "setA", b: 10 },
        testTwo: "setB",
      });

      return {
        body: null,
        status: 200,
      };
    });

    endpoint.data.handler({} as KintRequest, { global: {} });

    expect(runMiddleware).toHaveBeenCalled();
  });

  test("Global context is passed into the middleware and endpoint", async () => {
    const runEndpoint = jest.fn();
    const runMiddlewareOne = jest.fn();
    const runMiddlewareTwo = jest.fn();

    const kint = KintEndpointBuilder.new<{ a: string; b: number }>()
      .addMiddleware(
        buildTestMiddleware("testOne", (config, globalContext) => {
          runMiddlewareOne();
          expect(globalContext).toMatchObject({ a: "string", b: 10 });
          return null;
        }),
      )
      .addMiddleware(
        buildTestMiddleware("testTwo", (config, globalContext) => {
          runMiddlewareTwo();
          expect(globalContext).toMatchObject({ a: "string", b: 10 });
          return null;
        }),
      );

    const endpoint = kint.defineEndpoint({}, (request, context) => {
      runEndpoint();

      expect(context).toHaveProperty("global");
      expect(context.global).toMatchObject({ a: "string", b: 10 });

      return {
        body: null,
        status: 200,
      };
    });

    endpoint.data.handler({} as KintRequest, {
      global: { a: "string", b: 10 },
    });

    expect(runMiddlewareOne).toHaveBeenCalled();
    expect(runMiddlewareTwo).toHaveBeenCalled();
    expect(runEndpoint).toHaveBeenCalled();
  });
});
