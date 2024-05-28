import { Kint } from './Kint';

export type ExtractHandlerInput<K extends Kint<any, any, any, any>> =
	K extends Kint<any, any, infer HandlerInput, any> ? HandlerInput : never;
