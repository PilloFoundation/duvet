import { rootKint } from "../rootKint";
import { zodValidator } from "../../../src/core/zodValidator";
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
  zodValidator(
    z.object({
      name: z.string(),
    }),
    z.object({})
  ),
  (_req, { auth, valid }) => {
    console.log("running endpoint!");

    console.log("Got token: " + auth.token);
    console.log("Got name: " + valid.body.name);

    return {
      body: "Hello world!",
      status: 200,
    };
  }
);
