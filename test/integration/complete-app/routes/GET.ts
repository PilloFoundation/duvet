import { assert } from "console";
import { kint } from "../kint";
import { KintResponse } from "../../../../src/core/models/KintResponse";

export default kint.defineEndpoint({}, (request, { global }) => {
  assert(global.a === "initialA", "context.a should be 'initialA'");
  assert(global.b === 0, "context.b should be 0");

  global.a = "setA";
  global.b = 25;

  return new KintResponse("Does nothing", 200);
});
