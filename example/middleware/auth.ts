import { KintResponse } from "../../src";
import { PreprocessingMiddleware } from "../../src/core/models/middleware/PreprocessingMiddleware";

export type Role = "admin" | "user";

export function auth(): PreprocessingMiddleware<{
  required: boolean;
  credentials: {
    username: string;
    password: string;
  };
}> {
  return {
    preProcess: (request, config) => {
      console.log("running auth");

      if (config.required) {
        if (!request.underlyingExpressRequest.headers.authorization) {
          throw new KintResponse("No authorization header provided", 403);
        }
      }
    },
  };
}
