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
});
