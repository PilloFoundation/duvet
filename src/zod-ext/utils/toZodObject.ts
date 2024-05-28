import { z } from 'zod';
import { ZodSchemaDefinition } from '../models/ZodSchemaDefinition';

export function toZodObject<T extends ZodSchemaDefinition>(
	schemaDefinition: T
) {
	if (schemaDefinition instanceof z.ZodType) {
		return schemaDefinition as z.ZodType;
	} else {
		return z.object(schemaDefinition);
	}
}
