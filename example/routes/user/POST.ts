import { z } from "zod";
import { userKint } from "./userKint";
import { adminKint } from "../admin/adminKint";

export default adminKint.defineZodEndpoint(
  {
    requiredCredentials: {
      username: "Jeff",
      password: "bezosIsCool",
    },
    requestBody: {
      username: z.string(),
    },
  },
  (kint, context) => {
    kint.body.username;

    return kint.response.send(200, `Hello ${kint.body.username}!`);
  }
);
