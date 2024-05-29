import { buildPreProcessingMiddleware } from "../../src";

export function log() {
  return buildPreProcessingMiddleware<{ log: boolean; moduleName: string }>(
    (request, config) => {
      console.log(
        `${request.underlyingExpressRequest.method} request from ${
          config.moduleName
        }. Body: ${JSON.stringify(request)}`
      );
    }
  );
}
