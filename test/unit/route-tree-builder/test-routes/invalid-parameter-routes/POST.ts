import { z } from "zod";
import { kint } from "../../kint";

export default kint.defineEndpoint(
  {
    urlParams: {
      doesNotExist: z.string(),
    },
  },
  () => {
    // Do nothing, should throw.
  }
);
