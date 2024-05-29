import { adminKint } from "./adminKint";

export default adminKint.defineEndpoint({}, (kint) => {
  return kint.response.send(200, "Welcome, admin");
});
