import { ConfigurableHandler } from "../models/ConfigurableHandler";
import { WithValid } from "../models/DefineEndpointFunction";
import { KintRequest } from "../models/KintRequest";
import {
  ValidatedData,
  isValidatorArrayFlat,
  Validator,
  ValidatorArray,
} from "../models/Validator";

/**
 * Runs a validator on the given request and updates the `acc` object with the validated data.
 * @template Validators The type of the validator array.
 * @param acc The object to store the validated data.
 * @param validator The validator function to run.
 * @param request The request object to validate.
 * @returns The updated `acc` object with the validated data.
 * @throws Throws an error if the validation fails.
 */
function runValidator<Validators extends ValidatorArray>(
  acc: ValidatedData<Validators>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: Validator<string, any>,
  request: KintRequest,
) {
  const result = validator.validate(request);

  if (result.isValid) {
    // eslint-disable-next-line no-type-assertion/no-type-assertion -- We know that result.field is a key of acc
    acc[result.field as keyof typeof acc] = result.parsedData;
    return acc;
  } else {
    throw new Error(result.error);
  }
}

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
      if (isValidatorArrayFlat(validator)) {
        validator.reduce((acc, validator) => {
          runValidator(acc, validator, request);
          return acc;
        }, acc);
        return acc;
      }

      runValidator(acc, validator, request);
      return acc;
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
