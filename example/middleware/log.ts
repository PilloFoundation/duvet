import { buildPreProcessingMiddleware } from "../../src";

export function log() {
  return buildPreProcessingMiddleware<{ moduleName: string }>(
    (request, config) => {
      console.log(
        `${request.underlying.method} request from ${config.moduleName}`
      );
    }
  );
}
