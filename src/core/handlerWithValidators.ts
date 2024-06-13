import { Handler } from "./models/Handler";
import { WithValid } from "./models/DefineEndpointFunction";
import { ValidatedData, ValidatorArray } from "./models/Validator";

export function handlerWithValidators<
  Context,
  Config,
  Validators extends ValidatorArray
>(
  innerHandler: Handler<WithValid<Context, Validators>, Config>,
  validators: Validators
): Handler<Context, Config> {
  const handler: Handler<Context, Config> = (request, context, config) => {
    const validatedData = validators.reduce((acc, validator) => {
      const result = validator.validate(request);

      if (result.isValid) {
        acc[result.field as keyof typeof acc] = result.parsedData;
        return acc;
      } else {
        throw new Error(result.error);
      }
    }, {} as ValidatedData<Validators>);

    (context as WithValid<Context, Validators>).valid = validatedData;

    return innerHandler(
      request,
      context as WithValid<Context, Validators>,
      config
    );
  };

  return handler;
}
