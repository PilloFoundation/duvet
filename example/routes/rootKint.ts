import { kint } from "../kint";
import { log } from "../middleware/log";
import { auth } from "../middleware/auth";

export const rootKint = kint
  .preprocessingMiddleware(log())
  .preprocessingMiddleware(auth());
