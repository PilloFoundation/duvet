import { Kint } from './Kint';

export type ExtractConfig<K extends Kint<any, any, any, any>> = K extends Kint<
	any,
	infer Config,
	any,
	any
>
	? Config
	: never;
