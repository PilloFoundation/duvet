import { rootKint } from "../rootKint";

import { zodBodyValidator } from "../../../src/core/zodValidator";
import { z } from "zod";

export default rootKint.defineEndpoint(
  {
    logging: {
      module: "TEST",
    },
    auth: {
      method: "bearer",
    },
  },
  zodBodyValidator(
    z.object({
      name: z.string(),
    })
  ),
  (_req, k) => {
    console.log("running endpoint!");

    console.log("Got token: " + k.auth.token);

    k.valid.body.name;

    return {
      body: "Hello world!",
      status: 200,
    };
  }
);
