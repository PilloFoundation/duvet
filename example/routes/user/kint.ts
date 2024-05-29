import { routesKint } from "../kint";

export const userKint = routesKint.extendConfig({
  required: true,
  credentials: {
    username: "Jeff",
    password: "password",
  },
});
