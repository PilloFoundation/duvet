import { KintResponse } from "../../src";
import { PreProcessingMiddleware } from "../../src/core/models/middleware/PreProcessingMiddleware";

export type Role = "admin" | "user";

export function auth(): PreProcessingMiddleware<{
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
