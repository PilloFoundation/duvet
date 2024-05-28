import { Kint } from './Kint';

export type ExtractPostProcessors<K extends Kint<any, any, any, any>> =
	K extends Kint<any, any, any, infer PostProcessors> ? PostProcessors : never;
