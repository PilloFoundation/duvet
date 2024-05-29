import { KintResponse } from "../../src";
import { PreProcessingMiddleware } from "../../src/core/models/middleware/PreProcessingMiddleware";

export type Role = "admin" | "user";

export function auth(): PreProcessingMiddleware<{
  requiredCredentials?: {
    username: string;
    password: string;
  };
}> {
  return {
    preProcess: (request, config) => {
      if (config.requiredCredentials) {
        if (!request.underlying.headers.authorization) {
          throw new KintResponse("No authorization header provided", 403);
        }

        const username = request.underlying.body["username"] ?? undefined;
        const password = request.underlying.body["password"] ?? undefined;

        if (username == null || password == null) {
          throw new KintResponse("No username or password provided", 403);
        }

        if (
          username !== config.requiredCredentials.username ||
          password !== config.requiredCredentials.password
        ) {
          throw new KintResponse("Invalid username or password", 403);
        }
      }
    },
  };
}
