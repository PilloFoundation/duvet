import { ZodTypeAny } from 'zod';

export interface ZodRawShapePrimitives {
	[k: string]: ZodTypeAny;
}

export type ZRSP = ZodRawShapePrimitives;
