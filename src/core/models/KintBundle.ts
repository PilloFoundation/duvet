import { KintEndpointBuilder } from "../KintEndpointBuilder";

export type KintBuilder<GlobalContext, AppType> = {
  kint: KintEndpointBuilder<{ global: GlobalContext }, {}, {}>;
  build(directory: string, context: GlobalContext): AppType;
};
