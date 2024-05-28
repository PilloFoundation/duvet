import { ZodSchemaDefinition } from './ZodSchemaDefinition';
import { toZodObject } from './utils/toZodObject';

export function parseSchemaDefinition<T extends ZodSchemaDefinition, U>(
	schemaDefinition: T,
	parseObject: U
) {
	return toZodObject(schemaDefinition).safeParse(parseObject);
}
