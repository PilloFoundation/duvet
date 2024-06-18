import { KintResponse } from "express-kint";
import { buildMiddleware } from "express-kint/src/core/buildMiddleware";

export const errorHandlingMiddleware = buildMiddleware(
  "errorHandling",
  (_, next: () => KintResponse) => {
    console.log("[BEFORE CATCH MIDDLEWARE]");

    let response;
    try {
      response = next();
    } catch (e) {
      console.log(" = CAUGHT ERROR = ");
      response = {
        status: 500,
        body: `Internal server error: ${e}`,
      };
    }

    console.log("[AFTER CATCH MIDDLEWARE]");
    return response;
  },
);
