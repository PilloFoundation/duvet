import { ZodError, ZodTypeAny, output } from "zod";
import { Validator } from "../core/models/Validator";
import { KintRequest } from "../core/models/KintRequest";

/**
 * Validates a specific field in a request using a Zod schema.
 *
 * @template Field - The type of field to validate (e.g., "body", "params", "query").
 * @template ZodSchema - The Zod schema to use for validation.
 * @param  field - The field to validate.
 * @param schema - The Zod schema to use for validation. If not provided, the field will be considered valid.
 * @returns  The validation result.
 */
function zodRequestFieldValidator<
  Field extends
    | "body"
    | "params"
    | "query"
    | "headers"
    | "cookies"
    | "signedCookies",
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

type ZodValidator<
  BodyZodSchema extends ZodTypeAny,
  ParamsZodSchema extends ZodTypeAny,
  QueryZodSchema extends ZodTypeAny,
  HeadersZodSchema extends ZodTypeAny,
  CookiesZodSchema extends ZodTypeAny,
  SignedCookiesZodSchema extends ZodTypeAny,
> = [
  Validator<"body", output<BodyZodSchema>>,
  Validator<"params", output<ParamsZodSchema>>,
  Validator<"query", output<QueryZodSchema>>,
  Validator<"headers", output<HeadersZodSchema>>,
  Validator<"cookies", output<CookiesZodSchema>>,
  Validator<"signedCookies", output<SignedCookiesZodSchema>>,
];

/**
 * Creates an array of validators for the request data using Zod schemas.
 *
 * @param validator - The Zod schema to use to validate the request.
 *
 * Supported fields:
 * @param validator.body - Body schema
 * @param validator.params - Params schema
 * @param validator.query - Query schema
 * @param validator.headers - Headers schema
 * @param validator.cookies - Cookies schema
 * @param validator.signedCookies - SignedCookies schema
 * @returns - A new kint validator array
 */
export function zodValidator<
  BodyZodSchema extends ZodTypeAny,
  ParamsZodSchema extends ZodTypeAny,
  QueryZodSchema extends ZodTypeAny,
  HeadersZodSchema extends ZodTypeAny,
  CookiesZodSchema extends ZodTypeAny,
  SignedCookiesZodSchema extends ZodTypeAny,
>(validator: {
  body?: BodyZodSchema;
  params?: ParamsZodSchema;
  query?: QueryZodSchema;
  headers?: HeadersZodSchema;
  cookies?: CookiesZodSchema;
  signedCookies?: SignedCookiesZodSchema;
}): ZodValidator<
  BodyZodSchema,
  ParamsZodSchema,
  QueryZodSchema,
  HeadersZodSchema,
  CookiesZodSchema,
  SignedCookiesZodSchema
> {
  return [
    zodRequestFieldValidator("body", validator.body),
    zodRequestFieldValidator("params", validator.params),
    zodRequestFieldValidator("query", validator.query),
    zodRequestFieldValidator("headers", validator.headers),
    zodRequestFieldValidator("cookies", validator.cookies),
    zodRequestFieldValidator("signedCookies", validator.signedCookies),
  ];
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
