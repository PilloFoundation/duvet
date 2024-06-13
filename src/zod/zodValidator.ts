import { ZodError, ZodTypeAny, output } from "zod";
import { Validator } from "../core/models/Validator";
import { KintRequest } from "../core/models/KintRequest";

export function zodBodyValidator<BodyZodSchema extends ZodTypeAny>(
  body: BodyZodSchema
): Validator<"body", output<BodyZodSchema>> {
  return {
    validate: (request: KintRequest) => {
      const bodyResult = body.safeParse(request.underlying.body);

      if (bodyResult.success === false) {
        const errorMessage = formatZodError(bodyResult.error);

        console.log(errorMessage);
        return {
          isValid: false,
          error: errorMessage,
        };
      }

      return {
        isValid: true,
        field: "body",
        parsedData: bodyResult.data,
      };
    },
  };
}

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
