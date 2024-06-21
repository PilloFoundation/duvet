import { DuvetResponse } from "express-duvet";
import { buildMiddleware } from "express-duvet/src/core/buildMiddleware";

export const errorHandlingMiddleware = buildMiddleware(
  "errorHandling",
  (_, next: () => DuvetResponse) => {
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
