import { kint } from "../../../../kint";
import { KintResponse } from "../../../../../../../src/core/models/KintResponse";
import { zodValidator } from "../../../../../../../src/zod/zodValidator";
import { z } from "zod";

export default kint.defineEndpoint(
  {},
  zodValidator({ params: z.object({ test: z.coerce.number() }) }),
  (request, k) => {
    // Returns the value of the "test" query parameter.
    return new KintResponse(k.valid.params.test.toString(), 200);
  },
);
