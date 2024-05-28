import { createKint } from "../../../src/core/createKint";

export interface Context {
  a: string;
  b: number;
}

export const kint = createKint<Context>();
