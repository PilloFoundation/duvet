import { buildMiddleware } from "../../src/core/buildMiddleware";

export const catchMW = buildMiddleware<"catch", null, null>(
  "catch",
  (request, config, next) => {
    try {
      return next(null);
    } catch (e) {
      console.error(e);
      return {
        status: 500,
        body: "Internal server error",
      };
    }
  }
);
