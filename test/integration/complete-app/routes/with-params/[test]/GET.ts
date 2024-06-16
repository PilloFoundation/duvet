import { kint } from "../../../kint";
import { KintResponse } from "../../../../../../src/core/models/KintResponse";
import { zodParamsValidator } from "../../../../../../src/zod/zodValidator";
import { z } from "zod";

export default kint.defineEndpoint(
  {},
  zodParamsValidator(z.object({ test: z.coerce.number() })),
  (req, k) => {
    // Returns the value of the "test" query parameter.
    return new KintResponse(k.valid.params.test.toString(), 200);
  },
);
