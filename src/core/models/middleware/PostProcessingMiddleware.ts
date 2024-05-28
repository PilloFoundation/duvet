import { KintRequest } from '../KintRequest';
import { KintResponse } from '../KintResponse';
import { MaybePromise } from '../../../utils/types/MaybePromise';

export type PostProcessingMiddleware<Config, CatchType extends object> = {
	/**
	 * Default configuration for this middleware.
	 */
	defaultConfig: Config;
	/**
	 * The matcher function is used to determine whether or not this middleware should catch the error thrown by either another middleware
	 * or the endpoint handler.
	 *
	 * @param thrown The error thrown by either another middleware or the endpoint handler.
	 * @returns Whether or not this middleware should catch the error.
	 */
	matcher: (thrown: any) => thrown is CatchType;
	/**
	 * The handler function is called when the matcher function returns true. It is used to handle the error thrown by either another middleware.
	 *
	 * @param thrown The object thrown by either another middleware or the endpoint handler.
	 * @param request The request object.
	 * @param config The configuration object for this middleware.
	 * @returns A KintResponse object which will be sent to the user or void if no response should be sent.
	 */
	handler: (
		thrown: CatchType,
		request: KintRequest,
		config: Config
	) => MaybePromise<KintResponse>;
};
