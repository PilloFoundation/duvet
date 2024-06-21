import { duvet } from "../../duvet";
import { DuvetResponse } from "../../../../../src/core/models/DuvetResponse";

export default duvet.defineEndpoint({}, async () => {
  const promise = new Promise<DuvetResponse>((resolve) => {
    setTimeout(() => {
      resolve(new DuvetResponse("Success", 200));
    }, 10);
  });
  return promise;
});
