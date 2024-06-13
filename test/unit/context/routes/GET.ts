import { assert } from "console";
import { kint } from "../kint";
import { KintResponse } from "../../../../src/core/models/KintResponse";

export default kint.defineEndpoint({}, (req, { global }) => {
  assert(global.a === "initialA", "ctx.a should be 'initialA'");
  assert(global.b === 0, "ctx.b should be 0");

  global.a = "setA";
  global.b = 25;

  return new KintResponse("Does nothing", 200);
});
