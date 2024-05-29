import { rootKint } from "../rootKint";

export const adminKint = rootKint.extendConfig({
  requiredCredentials: {
    password: "admin",
    username: "admin",
  },
  moduleName: "Admin",
});
