import { DuvetRequest } from "../../../src";
import { wrapHandlerWithValidationLayer } from "../../../src/core/endpoint-builder/handlerWithValidators";
import { Validator } from "../../../src/core/models/Validator";

describe("Validation wrapper", () => {
  test("Wraps a handler with a validation layer", async () => {
    const doStuff = jest.fn(() => {});

    const validateOne = jest.fn(() => {});
    const validateTwo = jest.fn(() => {});

    const testValidatorOne: Validator<"testOne", number> = {
      validate: (request) => {
        expect(request.underlying.body).toEqual("body data");
        validateOne();
        return {
          isValid: true,
          field: "testOne",
          parsedData: 10,
        };
      },
    };
    const testValidatorTwo: Validator<"testTwo", { validatedData: string }> = {
      validate: (request) => {
        expect(request.underlying.body).toEqual("body data");
        validateTwo();
        return {
          isValid: true,
          field: "testTwo",
          parsedData: {
            validatedData: "validated",
          },
        };
      },
    };

    const validators = [testValidatorOne, testValidatorTwo];

    type Validators = typeof validators;

    const wrappedHandler = wrapHandlerWithValidationLayer<
      { contextData: string },
      { configData: string },
      Validators
    >((request, context) => {
      expect(request.underlying.body).toEqual("body data");
      expect(context.valid.testOne).toEqual(10);
      expect(context.valid.testTwo).toEqual({
        validatedData: "validated",
      });
      expect(context.contextData).toEqual("context data");

      doStuff();

      return {
        body: "ok",
        status: 200,
      };
    }, validators);

    const result = await wrappedHandler(
      { underlying: { body: "body data" } } as DuvetRequest,
      { contextData: "context data" },
      { configData: "config data" },
    );

    expect(doStuff.mock.calls).toHaveLength(1);
    expect(validateOne.mock.calls).toHaveLength(1);
    expect(validateTwo.mock.calls).toHaveLength(1);
    expect(result).toMatchObject({ status: 200, body: "ok" });
  });
});
