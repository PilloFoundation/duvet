import { kint } from "../kint";
import { KintResponse } from "../../../../src/core/models/KintResponse";
import { zodBodyValidator } from "../../../../src/zod/zodValidator";
import { z } from "zod";

export default kint.defineEndpoint(
  {},
  zodBodyValidator(z.object({ value: z.string() })),
  (req, k) => {
    // Returns the value of the "value" body parameter.
    return new KintResponse(k.valid.body.value, 200); // TODO: Make params type-safe
  },
);
