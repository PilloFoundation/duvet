import { KintEndpointBuilder } from "../endpoint-builder/KintEndpointBuilder";

export type KintBuilder<GlobalContext, AppType> = {
  kint: KintEndpointBuilder<{ global: GlobalContext }, {}, {}, GlobalContext>;
  build(directory: string, context: GlobalContext): AppType;
};
