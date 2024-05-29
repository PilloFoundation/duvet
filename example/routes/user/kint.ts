import { routesKint } from "../kint";

export const userKint = routesKint.extendConfig({
  requiredCredentials: {
    username: "Jeff",
    password: "password",
  },
});
