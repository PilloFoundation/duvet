import { ZodRawShapePrimitives } from "./ZodRawShapePrimitives";
import { ZodSchemaDefinition } from "./ZodSchemaDefinition";

export type ZodEndpointConfig<
  Body extends ZodSchemaDefinition,
  UrlParams extends ZodRawShapePrimitives,
  QueryParams extends ZodRawShapePrimitives
> = {
  requestBody?: Body;
  urlParams?: UrlParams;
  queryParams?: QueryParams;
};
