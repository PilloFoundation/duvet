import { z } from "zod";
import { defineExpressEndpoint } from "../kint";

export default defineExpressEndpoint(
  {
    urlParams: {
      doesNotExist: z.string(),
    },
  },
  (req, res, ctx) => {
    // Do nothing, should throw.
  }
);
