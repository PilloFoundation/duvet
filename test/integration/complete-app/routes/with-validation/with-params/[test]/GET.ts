import { duvet } from "../../../../duvet";
import { DuvetResponse } from "../../../../../../../src/core/models/DuvetResponse";
import { zodValidator } from "../../../../../../../src/zod/zodValidator";
import { z } from "zod";

export default duvet.defineEndpoint(
  {},
  zodValidator({ params: z.object({ test: z.coerce.number() }) }),
  (request, k) => {
    // Returns the value of the "test" query parameter.
    return new DuvetResponse(k.valid.params.test.toString(), 200);
  },
);
