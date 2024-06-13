import { kint } from "../kint";
import { authMiddleware } from "../middleware/auth";
import { errorHandlingMiddleware } from "../middleware/errorHandling";
import { loggingMiddleware } from "../middleware/logging";

export const rootKint = kint
  .addMiddleware(errorHandlingMiddleware)
  .addMiddleware(authMiddleware)
  .addMiddleware(loggingMiddleware);
