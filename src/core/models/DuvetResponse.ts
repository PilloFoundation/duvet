export class DuvetResponse {
  body: unknown;
  status: number;

  constructor(responseBody: unknown, status: number) {
    this.body = responseBody;
    this.status = status;
  }
}
