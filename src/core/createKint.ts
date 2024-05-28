import { KintRequest } from '../models/KintRequest';
import { Kint } from '../models/Kint/Kint';

export function createKint<Context>(): Kint<Context, {}, [], []> {
	return new Kint<Context, {}, [], []>({}, [], []);
}
