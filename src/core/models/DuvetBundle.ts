import { DuvetEndpointBuilder } from "../endpoint-builder/DuvetEndpointBuilder";

export type DuvetBuilder<GlobalContext, AppType> = {
  duvet: DuvetEndpointBuilder<{ global: GlobalContext }, {}, {}, GlobalContext>;
  build(directory: string, context: GlobalContext): AppType;
};
