import { assert } from "console";
import { defineExpressEndpoint } from "../kint";

export default defineExpressEndpoint({}, (req, res, ctx) => {
  assert(ctx.a === "initialA", "ctx.a should be 'initialA'");
  assert(ctx.b === 0, "ctx.b should be 0");

  ctx.a = "setA";
  ctx.b = 25;

  res.status(200).send("Success");
});
