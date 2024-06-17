import { kint } from "../kint";
import { KintResponse } from "../../../../src/core/models/KintResponse";
import { zodValidator } from "../../../../src/zod/zodValidator";
import { z } from "zod";

export default kint.defineEndpoint(
  {},
  zodValidator({
    body: z.object({ value: z.string() }),
  }),
  (req, k) => {
    // Returns the value of the "value" body parameter.
    return new KintResponse(k.valid.body.value, 200);
  },
);
