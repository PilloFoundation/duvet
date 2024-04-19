import { AppBuilder } from "./AppBuilder";

export type RouterFromAppBuilder<T> =
	T extends AppBuilder<any, infer R> ? R : never;
