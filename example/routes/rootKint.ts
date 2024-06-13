import { kint } from "../kint";
import { catchMW } from "../middleware/catchMW";
import { testMW } from "../middleware/testMW";

export const rootKint = kint
  .addMiddleware(testMW("middlewareA"))
  .addMiddleware(testMW("middlewareC"))
  .addMiddleware(catchMW)
  .extendConfig({
    middlewareA: "A",
  });
