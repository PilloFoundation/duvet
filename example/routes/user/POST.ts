import { KintResponse } from "../../../src/core/models/KintResponse";
import { userKint } from "./kint";

export default userKint.defineZodEndpoint(
  {
    moduleName: "User",
  },
  (input, context) => {
    input.body.username;

    console.log("Running...");

    return new KintResponse("Name: " + input.body.username, 200);
  }
);
