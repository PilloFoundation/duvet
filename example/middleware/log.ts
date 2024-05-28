import { json } from "stream/consumers";
import { PreprocessingMiddleware } from "../../src/core/models/middleware/PreprocessingMiddleware";

export function log(): PreprocessingMiddleware<{ moduleName?: string }> {
  return {
    defaultConfig: {
      moduleName: "Unknown Module",
    },
    preProcess: (request, config) => {
      console.log(
        `${request.underlyingExpressRequest.method} request from ${
          config.moduleName
        }. Body: ${JSON.stringify(request)}`
      );
    },
  };
}
