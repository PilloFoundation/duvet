import { PreprocessingMiddleware } from "../../src/core/models/middleware/PreprocessingMiddleware";

export function log(): PreprocessingMiddleware<{ moduleName: string }> {
  return {
    defaultConfig: {
      moduleName: "Unknown Module",
    },
    preProcess: (request, config) => {
      console.log(config.moduleName);
    },
  };
}
