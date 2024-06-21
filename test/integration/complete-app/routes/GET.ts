import { assert } from "console";
import { duvet } from "../duvet";
import { DuvetResponse } from "../../../../src/core/models/DuvetResponse";

export default duvet.defineEndpoint({}, (request, { global }) => {
  assert(global.a === "initialA", "context.a should be 'initialA'");
  assert(global.b === 0, "context.b should be 0");

  global.a = "setA";
  global.b = 25;

  return new DuvetResponse("Does nothing", 200);
});
