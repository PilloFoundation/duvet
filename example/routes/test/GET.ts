import { rootKint } from "../rootKint";

import { zodValidator } from "../../../src/zod/zodValidator";
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
  zodValidator({
    body: z.object({
      name: z.string(),
    }),
  }),
  async (_req, k) => {
    console.log("running endpoint!");
    console.log("Got token: " + k.auth.token);

    k.valid.body.name;

    return {
      body: `Hi ${k.valid.body.name}!`,
      status: 200,
    };
  },
);
