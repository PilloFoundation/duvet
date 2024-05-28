export class KintResponse {
	body: any;
	status: number;

	constructor(responseBody: any, status: number) {
		this.body = responseBody;
		this.status = status;
	}
}
