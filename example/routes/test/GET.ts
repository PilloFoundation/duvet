import { rootKint } from "../rootKint";
import { zodValidator } from "../../../src/core/zodValidator";
import { z } from "zod";

export default rootKint.defineEndpoint(
  {
    middlewareC: "Test",
    catch: { source: "Testing endpoint" },
  },
  zodValidator(
    z.object({
      test: z.string(),
    }),
    z.object({})
  ),
  (req, k) => {
    console.log("running endpoint!");
    console.log("context: ", k);

    k.global.dbConnection;

    return {
      body: "Hello world!",
      status: 200,
    };
  }
);
