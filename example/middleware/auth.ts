import { buildMiddleware } from "../../src";

export const authMiddleware = buildMiddleware<
  "auth",
  { method: "bearer" | "none" },
  { token?: string }
>("auth", (request, next) => {
  console.log("[BEFORE AUTH MIDDLEWARE]");

  const req = request.underlying;
  let response;

  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    response = next({ token });
  }
  if (!response) {
    response = next({});
  }

  console.log("[AFTER AUTH MIDDLEWARE]");
  return response;
});
