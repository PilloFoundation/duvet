import { z } from "zod";
import { defineExpressEndpoint } from "../../kint";

export default defineExpressEndpoint(
  {
    urlParams: {
      test: z.string(),
    },
  },
  (req, res, ctx) => {}
);
