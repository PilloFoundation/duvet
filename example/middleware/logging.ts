import { buildMiddleware } from "../../src";

export const loggingMiddleware = buildMiddleware<
  "logging",
  void,
  { module: string }
>("logging", (request, next, { module }) => {
  console.log(
    `[${module}] Incoming ${request.underlying.method} request to ${request.underlying.baseUrl}${request.underlying.url}`
  );

  const response = next();

  console.log("[AFTER LOGGING MIDDLEWARE]");
  return response;
});
