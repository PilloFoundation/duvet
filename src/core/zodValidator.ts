import { ZodObject, ZodRawShape, ZodTypeAny, output } from "zod";
import { Validator } from "./models/Validator";
import { KintRequest } from "./models/KintRequest";

export function zodValidator<
  BodyZodSchema extends ZodTypeAny,
  ParamsZodSchema extends ZodObject<ZodRawShape>
>(
  body: BodyZodSchema,
  params: ParamsZodSchema
): Validator<output<BodyZodSchema>, output<ParamsZodSchema>> {
  return (request: KintRequest) => {
    const bodyResult = body.safeParse(request.underlying.body);

    const paramsResult = params.safeParse({
      ...request.underlying.params,
      ...request.underlying.query,
    });

    if (bodyResult.success === false) {
      return {
        isValid: false,
        error: bodyResult.error.errors[0].message,
      };
    } else if (paramsResult.success === false) {
      return {
        isValid: false,
        error: paramsResult.error.errors[0].message,
      };
    }

    return {
      isValid: true,
      parsedData: {
        body: bodyResult.data,
        params: paramsResult.data,
      },
    };
  };
}
