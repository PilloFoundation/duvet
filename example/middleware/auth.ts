import { buildMiddleware } from "express-duvet";

export const authMiddleware = buildMiddleware<
  "auth",
  { method: "bearer" | "none" },
  { token?: string }
>("auth", (request, next) => {
  console.log("[BEFORE AUTH MIDDLEWARE]");

  const request = request.underlying;
  let response;

  if (request.headers.authorization) {
    const token = request.headers.authorization.split(" ")[1];
    response = next({ token });
  }
  if (!response) {
    response = next({});
  }

  console.log("[AFTER AUTH MIDDLEWARE]");
  return response;
});
