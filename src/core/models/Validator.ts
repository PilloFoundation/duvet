import { KintRequest } from "./KintRequest";

export type Validator<Body, Params> = (
  request: KintRequest
) => ValidationResult<Body, Params>;

export type ValidationFailure = {
  isValid: false;
  error: string;
};

export type ValidationResult<Body, Params> =
  | ValidationSuccess<Body, Params>
  | ValidationFailure;

export type ValidationSuccess<Body, Params> = {
  isValid: true;
  parsedData: {
    body: Body;
    params: Params;
  };
};
