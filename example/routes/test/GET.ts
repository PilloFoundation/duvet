import { rootDuvet } from "../rootDuvet";

import { zodValidator } from "express-duvet/src/zod/zodValidator";
import { z } from "zod";

export default rootDuvet.defineEndpoint(
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
