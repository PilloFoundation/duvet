import { ConfigurableHandler } from "./models/ConfigurableHandler";
import { WithValid } from "./models/DefineEndpointFunction";
import { ValidatedData, ValidatorArray } from "./models/Validator";

/**
 * Takes a handler and wraps it in a new handler which validates the request data.
 * @param innerHandler The handler to wrap.
 * @param validators An array of validators to use to validate the request data.
 * @returns The wrapped handler.
 */
export function wrapHandlerWithValidationLayer<
  Context,
  Config,
  Validators extends ValidatorArray,
>(
  innerHandler: ConfigurableHandler<WithValid<Context, Validators>, Config>,
  validators: Validators,
): ConfigurableHandler<Context, Config> {
  const handler: ConfigurableHandler<Context, Config> = (
    request,
    context,
    config,
  ) => {
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
      config,
    );
  };

  return handler;
}
