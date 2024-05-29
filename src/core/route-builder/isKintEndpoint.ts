import { Endpoint } from "../models/Endpoint";

export function isKintEndpoint(
  test: any
): test is Endpoint<any, any, any, any> {
  return test?.builtByKint === true;
}
