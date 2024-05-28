import { KintResponse } from "../../../../../src/core/models/KintResponse";
import { kint } from "../../kint";

export default kint.defineZodEndpoint({}, (request, response, context) => {
  return new KintResponse("Does nothing", 200);
});
