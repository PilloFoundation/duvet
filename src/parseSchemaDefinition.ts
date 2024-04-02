import { z } from 'zod';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';

export function parseSchemaDefinition<T extends ZodSchemaDefinition, U>(
	schemaDefinition: T,
	parseObject: U
) {
	if (schemaDefinition instanceof z.ZodType) {
		return schemaDefinition.safeParse(parseObject);
	} else {
		const zodObject = z.object(schemaDefinition);
		return zodObject.safeParse(parseObject);
	}
}
