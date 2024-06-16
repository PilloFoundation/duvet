import { kint } from "../../kint";
import { KintResponse } from "../../../../../src/core/models/KintResponse";

export default kint.defineEndpoint({}, async () => {
  const promise = new Promise<KintResponse>((resolve) => {
    setTimeout(() => {
      resolve(new KintResponse("Success", 200));
    }, 10);
  });
  return promise;
});
