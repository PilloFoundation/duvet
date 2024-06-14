import { Kint } from "../Kint";

export type KintBuilder<GlobalContext, AppType> = {
  kint: Kint<{ global: GlobalContext }, {}, {}>;
  build(directory: string, context: GlobalContext): AppType;
};
