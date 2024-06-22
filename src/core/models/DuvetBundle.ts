import { DuvetEndpointBuilder } from "../endpoint-builder/DuvetEndpointBuilder";

export type DuvetBuilder<GlobalContext, AppType> = {
  duvet: DuvetEndpointBuilder<
    { global: GlobalContext },
    {},
    {},
    GlobalContext,
    { global: GlobalContext }
  >;
  build(directory: string, context: GlobalContext): AppType;
};
