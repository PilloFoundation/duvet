import { Kint } from './Kint';

export type ExtractContext<K extends Kint<any, any, any, any>> = K extends Kint<
	infer Context,
	any,
	any,
	any
>
	? Context
	: never;
