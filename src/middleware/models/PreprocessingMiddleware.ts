import { KintRequest } from '../../models/KintRequest';
import { KintResponse } from '../../models/KintResponse';

export type PreprocessingMiddleware<
	Config,
	RequestExtension extends object = {}
> = {
	/**
	 *
	 * This function is called before the request is processed by the core Kint logic. It can be used to modify the request object
	 * or send a response immediately to the user.
	 *
	 * To modify the request object, return a new object which you would like to be merged with the request object and passed
	 * to the next middleware or the endpoint handler.
	 *
	 * To send a response immediately, return a KintResponse object.
	 *
	 * @param request The request object
	 * @param config A configuration object for the middleware
	 * @returns Either the request extension object which will be used to extend the request object or a KintResponse object which will send a response immediately.
	 */
	preProcess: (
		request: KintRequest,
		config: Config
	) => RequestExtension | KintResponse | void;
	defaultConfig: Config;
};
