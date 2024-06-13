import { z } from "zod";
import { kint } from "../../../kint";
import { KintResponse } from "../../../../../../src";

export default kint.defineEndpoint(
  {
    urlParams: {
      test: z.string(),
    },
  },
  () => {
    return new KintResponse("Does nothing", 200);
  }
);
