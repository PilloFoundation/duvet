import { DuvetEndpointBuilder } from "../endpoint-builder/DuvetEndpointBuilder";
import { BaseContext } from "./BaseContext";

export type DuvetBuilder<RequestType, ResponseType, GlobalContext, AppType> = {
  duvet: DuvetEndpointBuilder<
    RequestType,
    ResponseType,
    BaseContext<GlobalContext>,
    {},
    {},
    GlobalContext,
    BaseContext<GlobalContext>
  >;
  build(directory: string, context: GlobalContext): AppType;
};
