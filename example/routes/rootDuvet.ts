import { duvet } from "../duvet";
import { authMiddleware } from "../middleware/auth";
import { errorHandlingMiddleware } from "../middleware/errorHandling";
import { loggingMiddleware } from "../middleware/logging";

export const rootDuvet = duvet
  .addMiddleware(errorHandlingMiddleware)
  .addMiddleware(authMiddleware)
  .addMiddleware(loggingMiddleware);
