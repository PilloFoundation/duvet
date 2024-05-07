import { KintBuilder } from "../kint";

export type Plugin<T> = {
	extend: (builder: KintBuilder<T>) => void;
};
