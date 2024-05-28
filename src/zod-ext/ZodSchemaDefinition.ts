import { ZodRawShape, ZodTypeAny } from 'zod';

export type ZodSchemaDefinition = ZodRawShape | ZodTypeAny;
export type ZSD = ZodSchemaDefinition;
