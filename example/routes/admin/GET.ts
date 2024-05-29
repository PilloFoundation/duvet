import { adminKint } from "./kint";

export default adminKint.defineZodEndpoint({}, (kint) => {
  return kint.response.send(200, "Welcome, admin");
});
