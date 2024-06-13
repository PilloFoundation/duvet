import { Kint } from "./Kint";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KintBuilder<GlobalContext, AppType> = {
  kint: Kint<
    { global: GlobalContext },
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    {}
  >;
  build(directory: string, context: GlobalContext): AppType;
};
