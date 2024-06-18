import { buildMiddleware } from "express-kint/src/core/buildMiddleware";

export const loggingMiddleware = buildMiddleware<
  "logging",
  { module: string },
  void,
  void
>("logging", (request, next, { module }) => {
  console.log(
    `[${module}] Incoming ${request.underlying.method} request to ${request.underlying.baseUrl}${request.underlying.url}`,
  );

  const response = next();

  console.log("[AFTER LOGGING MIDDLEWARE]");
  return response;
});
