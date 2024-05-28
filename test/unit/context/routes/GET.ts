import { assert } from "console";
import { kint } from "../kint";
import { KintResponse } from "../../../../src/core/models/KintResponse";

export default kint.defineZodEndpoint({}, (req, ctx, cnf) => {
  assert(ctx.a === "initialA", "ctx.a should be 'initialA'");
  assert(ctx.b === 0, "ctx.b should be 0");

  ctx.a = "setA";
  ctx.b = 25;

  return new KintResponse("Does nothing", 200);
});
