import { KintResponse } from "../../../../../../src";
import { kint } from "../../../kint";

export default kint.defineZodEndpoint({}, () => {
  return new KintResponse("Does nothing", 200);
});
