import { kint } from "../kint";
import { log } from "../middleware/log";
import { auth } from "../middleware/auth";

export const routesKint = kint
  .preprocessingMiddleware(log())
  .preprocessingMiddleware(auth());
