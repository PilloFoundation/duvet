import { routesKint } from "../kint";

export const adminKint = routesKint.extendConfig({
  requiredCredentials: {
    password: "admin",
    username: "admin",
  },
  moduleName: "Admin",
});
