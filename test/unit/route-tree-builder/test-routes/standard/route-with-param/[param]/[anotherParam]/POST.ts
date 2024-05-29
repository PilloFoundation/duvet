import { z } from "zod";
import { kint } from "../../../../../kint";
import { KintResponse } from "../../../../../../../../src";

export default kint.defineZodEndpoint(
  {
    urlParams: {
      param: z.string(),
      anotherParam: z.string(),
    },
  },
  (request, response, context) => {
    return new KintResponse("Does nothing", 200);
  }
);
