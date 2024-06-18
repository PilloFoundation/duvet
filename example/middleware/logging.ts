import { buildMiddleware } from "express-kint/src/core/buildMiddleware";

export const loggingMiddleware = buildMiddleware<
  "logging",
  void,
  { module: string },
  void
>("logging", (request, next) => {
  console.log(
    `[${module}] Incoming ${request.underlying.method} request to ${request.underlying.baseUrl}${request.underlying.url}`,
  );

  const response = next();

  console.log("[AFTER LOGGING MIDDLEWARE]");
  return response;
});
