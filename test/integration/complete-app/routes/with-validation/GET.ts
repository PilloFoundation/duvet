import { duvet } from "../../duvet";
import { DuvetResponse } from "../../../../../src/core/models/DuvetResponse";
import { zodValidator } from "../../../../../src/zod/zodValidator";
import { z } from "zod";

export default duvet.defineEndpoint(
  {},
  zodValidator({
    body: z.object({ value: z.literal("body") }),
    query: z.object({ value: z.literal("query") }),
    headers: z.object({ value: z.literal("headers") }),
    cookies: z.object({ value: z.literal("cookies") }),
  }),
  (req, k) => {
    expect(k.valid.body.value).toBe("body");
    expect(k.valid.query.value).toBe("query");
    expect(k.valid.headers.value).toBe("headers");
    expect(k.valid.cookies.value).toBe("cookies");

    // Returns the value of the "test" query parameter.
    return new DuvetResponse("Success", 200);
  },
);
