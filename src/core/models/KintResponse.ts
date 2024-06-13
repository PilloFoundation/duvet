export class KintResponse {
  body: unknown;
  status: number;

  constructor(responseBody: unknown, status: number) {
    this.body = responseBody;
    this.status = status;
  }
}
