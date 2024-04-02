import { z, ZodRawShape, ZodTypeAny } from 'zod';

export type InferZodSchemaDefinition<T extends ZodRawShape | ZodTypeAny> =
	z.infer<T extends ZodRawShape ? z.ZodObject<T> : T>;
