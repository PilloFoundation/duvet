export interface GenericKintRequest<RequestBody, UrlParams, QueryParams> {
	requestBody: RequestBody;
	urlParams: UrlParams;
	queryParams: QueryParams;
}
