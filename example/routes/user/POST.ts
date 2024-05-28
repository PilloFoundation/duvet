import { z } from "zod";
import kint from "./kint";
import { KintResponse } from "../../../src/core/models/KintResponse";

export default kint.defineZodEndpoint(
  {
    requestBody: {
      name: z.string(),
    },
  },
  (input, context) => {
    input.body.name;

    console.log("Running...");

    return new KintResponse("Name: " + input.body.name, 200);
  }
);
