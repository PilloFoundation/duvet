import { Kint } from "./Kint";

export function createKint<Context>(): Kint<Context, {}, [], []> {
  return new Kint<Context, {}, [], []>({}, [], []);
}
