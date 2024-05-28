import { z, ZodRawShape, ZodTypeAny } from "zod";

export type InferZodSchemaDefinitionOutput<T extends ZodRawShape | ZodTypeAny> =
  z.output<T extends ZodRawShape ? z.ZodObject<T> : T>;

export type InferZodSchemaDefinitionInput<T extends ZodRawShape | ZodTypeAny> =
  z.input<T extends ZodRawShape ? z.ZodObject<T> : T>;
