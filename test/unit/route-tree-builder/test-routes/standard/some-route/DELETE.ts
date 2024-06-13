import { KintResponse } from "../../../../../../src";
import { kint } from "../../../kint";

export default kint.defineEndpoint({}, () => {
  return new KintResponse("Does nothing", 200);
});
