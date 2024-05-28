import { ZodSchemaDefinition } from './zod-ext/ZodSchemaDefinition';
import { toZodObject } from './zod-ext/utils/toZodObject';

export function parseSchemaDefinition<T extends ZodSchemaDefinition, U>(
	schemaDefinition: T,
	parseObject: U
) {
	return toZodObject(schemaDefinition).safeParse(parseObject);
}
