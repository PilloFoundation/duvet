import { Kint } from "./Kint";

export type KintBuilder<Context, AppType> = {
  kint: Kint<Context, {}, {}, [], []>;
  build(directory: string, context: Context): AppType;
};
