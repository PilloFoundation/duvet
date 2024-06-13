import { KintResponse } from "../../src";
import { buildMiddleware } from "../../src/core/buildMiddleware";

export const catchMW = buildMiddleware(
  "catch",
  (request, config: { source: string }, next: (ext: null) => KintResponse) => {
    try {
      return next(null);
    } catch (e) {
      return {
        status: 500,
        body: `Internal server error from ${config.source}: ${e}`,
      };
    }
  }
);
