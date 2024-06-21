import { duvet } from "../duvet";
import { DuvetResponse } from "../../../../src/core/models/DuvetResponse";
import { zodValidator } from "../../../../src/zod/zodValidator";
import { z } from "zod";

export default duvet.defineEndpoint(
  {},
  zodValidator({
    body: z.object({ value: z.string() }),
  }),
  (request, k) => {
    // Returns the value of the "value" body parameter.
    return new DuvetResponse(k.valid.body.value, 200);
  },
);
