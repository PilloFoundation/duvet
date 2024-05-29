import { z } from "zod";
import { kint } from "../../kint";

export default kint.defineZodEndpoint(
  {
    urlParams: {
      doesNotExist: z.string(),
    },
  },
  (req, res, ctx) => {
    // Do nothing, should throw.
  }
);
