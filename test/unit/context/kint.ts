import { createExpressKint } from "../../../src";
import { Context } from "./Context";

export const { build, kint } = createExpressKint<Context>();
