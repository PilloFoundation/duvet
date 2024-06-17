import { ZodError, ZodTypeAny, output } from "zod";
import { Validator } from "../core/models/Validator";
import { KintRequest } from "../core/models/KintRequest";

type RequestFields =
  | "body"
  | "params"
  | "query"
  | "headers"
  | "cookies"
  | "signedCookies";

/**
 * Validates a specific field in a request using a Zod schema.
 * @template Field - The type of field to validate (e.g., "body", "params", "query").
 * @template ZodSchema - The Zod schema to use for validation.
 * @param field - The field to validate.
 * @param schema - The Zod schema to use for validation. If not provided, the field will be considered valid.
 * @returns The validation result.
 */
function zodRequestFieldValidator<
  Field extends RequestFields,
  ZodSchema extends ZodTypeAny,
>(field: Field, schema?: ZodSchema): Validator<Field, output<ZodSchema>> {
  return {
    validate: (request: KintRequest) => {
      if (schema === undefined) {
        return {
          isValid: true,
          field,
          parsedData: {},
        };
      }

      const result = schema.safeParse(request.underlying[field]);

      if (result.success === false) {
        const errorMessage = formatZodError(result.error);

        console.log(errorMessage);
        return {
          isValid: false,
          error: errorMessage,
        };
      }

      return {
        isValid: true,
        field,
        parsedData: result.data,
      };
    },
  };
}

type RequestValidator = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  headers?: ZodTypeAny;
  cookies?: ZodTypeAny;
  signedCookies?: ZodTypeAny;
};

// Define the ZodValidatorTuple type with conditional types
type ZodValidatorTuple<ZodRequestValidator extends RequestValidator> = [
  ZodRequestValidator["body"] extends ZodTypeAny
    ? Validator<"body", output<ZodRequestValidator["body"]>>
    : never,
  ZodRequestValidator["params"] extends ZodTypeAny
    ? Validator<"params", output<ZodRequestValidator["params"]>>
    : never,
  ZodRequestValidator["query"] extends ZodTypeAny
    ? Validator<"query", output<ZodRequestValidator["query"]>>
    : never,
  ZodRequestValidator["headers"] extends ZodTypeAny
    ? Validator<"headers", output<ZodRequestValidator["headers"]>>
    : never,
  ZodRequestValidator["cookies"] extends ZodTypeAny
    ? Validator<"cookies", output<ZodRequestValidator["cookies"]>>
    : never,
  ZodRequestValidator["signedCookies"] extends ZodTypeAny
    ? Validator<"signedCookies", output<ZodRequestValidator["signedCookies"]>>
    : never,
];

// Define the ZodValidator type
type ZodValidator<ZodRequestValidator extends RequestValidator> =
  ZodValidatorTuple<ZodRequestValidator>;
/**
 * Creates an array of validators for the request data using Zod schemas.
 * @param validator - The Zod schema to use to validate the request.
 *
 * Supported fields:
 * @param validator.body - Body schema
 * @param validator.params - Params schema
 * @param validator.query - Query schema
 * @param validator.headers - Headers schema
 * @param validator.cookies - Cookies schema
 * @param validator.signedCookies - SignedCookies schema
 * @returns A new kint validator array
 */
export function zodValidator<ZodRequestValidator extends RequestValidator>(
  validator: ZodRequestValidator,
): ZodValidator<ZodRequestValidator> {
  const validators = [];

  if (validator.body) {
    validators.push(zodRequestFieldValidator("body", validator.body));
  }
  if (validator.params) {
    validators.push(zodRequestFieldValidator("params", validator.params));
  }
  if (validator.query) {
    validators.push(zodRequestFieldValidator("query", validator.query));
  }
  if (validator.headers) {
    validators.push(zodRequestFieldValidator("headers", validator.headers));
  }
  if (validator.cookies) {
    validators.push(zodRequestFieldValidator("cookies", validator.cookies));
  }
  if (validator.signedCookies) {
    validators.push(
      zodRequestFieldValidator("signedCookies", validator.signedCookies),
    );
  }

  return validators as ZodValidator<ZodRequestValidator>;
}

/**
 * Takes a Zod error and formats it into a string.
 * @param error The zod error to format.
 * @returns A human readable string representation of the error.
 */
function formatZodError(error: ZodError): string {
  let errorString: string = "";

  for (const issue of error.issues) {
    if (errorString.length > 0) {
      errorString += "\n";
    }

    if (issue.path.length > 0) {
      errorString += issue.path.join(".") + ": ";
    }

    errorString += issue.message;
  }

  return errorString;
}
