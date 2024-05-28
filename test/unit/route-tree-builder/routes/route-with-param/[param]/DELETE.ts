import { z } from "zod";
import { kint } from "../../../kint";
import { KintResponse } from "../../../../../../src/core/models/KintResponse";

export default kint.defineZodEndpoint(
  {
    urlParams: {
      param: z.string(),
    },
  },
  (request, response, context) => {
    return new KintResponse("Does nothing", 200);
  }
);
