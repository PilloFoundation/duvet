import { Endpoint } from './Endpoint';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type Resource<C> = {
	[method in Method]?: Endpoint<C, any, any, any>;
};
