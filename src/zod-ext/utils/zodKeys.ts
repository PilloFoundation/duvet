/**
 * Credit to https://github.com/navtoj
 *
 * This code was written by Navtoj Chahal as a response to a zod issue. The original code can be found here:
 *
 * https://github.com/colinhacks/zod/discussions/2134#discussioncomment-5194111
 */

import { z } from 'zod';

// get zod object keys recursively
export function zodKeys<T extends z.ZodTypeAny>(schema: T): string[] {
	// make sure schema is not null or undefined
	if (schema === null || schema === undefined) return [];
	// check if schema is nullable or optional
	if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
		return zodKeys(schema.unwrap());
	// check if schema is an array
	if (schema instanceof z.ZodArray) return zodKeys(schema.element);
	// check if schema is an object
	if (schema instanceof z.ZodObject) {
		// get key/value pairs from schema
		const entries = Object.entries(schema.shape);
		// loop through key/value pairs
		return entries.flatMap(([key, value]) => {
			// get nested keys
			const nested =
				value instanceof z.ZodType
					? zodKeys(value).map((subKey) => `${key}.${subKey}`)
					: [];
			// return nested keys
			return nested.length ? nested : key;
		});
	}
	// return empty array
	return [];
}
