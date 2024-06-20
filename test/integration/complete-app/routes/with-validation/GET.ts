import { kint } from "../../kint";
import { KintResponse } from "../../../../../src/core/models/KintResponse";
import { zodValidator } from "../../../../../src/zod/zodValidator";
import { z } from "zod";

export default kint.defineEndpoint(
  {},
  zodValidator({
    body: z.object({ value: z.literal("body") }),
    query: z.object({ value: z.literal("query") }),
    headers: z.object({ value: z.literal("headers") }),
    cookies: z.object({ value: z.literal("cookies") }),
  }),
  (request, k) => {
    expect(k.valid.body.value).toBe("body");
    expect(k.valid.query.value).toBe("query");
    expect(k.valid.headers.value).toBe("headers");
    expect(k.valid.cookies.value).toBe("cookies");

    // Returns the value of the "test" query parameter.
    return new KintResponse("Success", 200);
  },
);
