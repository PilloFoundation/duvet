import { ZodError, ZodTypeAny, output } from "zod";
import { Request as ExpressRequest } from "express";
import { Validator } from "../core/validation/Validator";

type RequestFields = "body" | "params" | "query" | "headers" | "cookies";

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
>(
  field: Field,
  schema: ZodSchema,
): Validator<ExpressRequest, output<ZodSchema>> {
  return (request: ExpressRequest) => {
    const result = schema.safeParse(request[field]);

    if (result.success === false) {
      const errorMessage = formatZodError(field, result.error);

      return {
        isValid: false,
        error: errorMessage,
      };
    }

    return {
      isValid: true,
      parsedData: result.data,
    };
  };
}

type GenericZodSchemaMap = {
  [Key in RequestFields]?: ZodTypeAny;
};

type ZodValidatorMap<ZodSchemaMap extends GenericZodSchemaMap> = {
  [K in RequestFields as ZodSchemaMap[K] extends ZodTypeAny
    ? K
    : never]-?: ZodSchemaMap[K] extends ZodTypeAny
    ? Validator<ExpressRequest, output<ZodSchemaMap[K]>>
    : never;
};

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
 * @returns A new duvet validator array
 */
export function zodValidator<ZodSchemaMap extends GenericZodSchemaMap>(
  validator: ZodSchemaMap,
): ZodValidatorMap<ZodSchemaMap> {
  const validators: { [key: string]: Validator<ExpressRequest, unknown> } = {};

  if (validator.body) {
    validators["body"] = zodRequestFieldValidator("body", validator.body);
  }
  if (validator.params) {
    validators["params"] = zodRequestFieldValidator("params", validator.params);
  }
  if (validator.query) {
    validators["query"] = zodRequestFieldValidator("query", validator.query);
  }
  if (validator.headers) {
    validators["headers"] = zodRequestFieldValidator(
      "headers",
      validator.headers,
    );
  }
  if (validator.cookies) {
    validators["cookies"] = zodRequestFieldValidator(
      "cookies",
      validator.cookies,
    );
  }

  return validators as ZodValidatorMap<ZodSchemaMap>;
}

/**
 * Takes a Zod error and formats it into a string.
 * @param fieldName The name of the field that failed validation.
 * @param error The zod error to format.
 * @returns A human readable string representation of the error.
 */
function formatZodError(fieldName: string, error: ZodError): string {
  let errorString: string = `${fieldName} validation failed: `;

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
