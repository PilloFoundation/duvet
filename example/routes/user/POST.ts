import { z } from "zod";
import { KintResponse } from "../../../src/core/models/KintResponse";
import { userKint } from "./kint";

export default userKint.defineZodEndpoint(
  {
    moduleName: "User",
    requestBody: {
      username: z.string(),
    },
  },
  (kint, context) => {
    kint.body.username;

    return kint.response.send(200, `Hello ${kint.body.username}!`);
  }
);
