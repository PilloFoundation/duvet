import { PreprocessingMiddleware } from "../src/core/models/middleware/PreprocessingMiddleware";
import { KintResponse } from "../src/core/models/KintResponse";
import { PostProcessingMiddleware } from "../src/core/models/middleware/PostProcessingMiddleware";
import { createKint } from "../src/core/createKint";
import { z } from "zod";
import { auth } from "./middleware/auth";
import { log } from "./middleware/log";

type Context = {
  dbConnection: {
    connect(): void;
  };
};

const rootKint = createKint<Context>();

class MySpecialError {
  poop: string;
}

function HandleErrors(): PostProcessingMiddleware<
  { doStuff: boolean },
  MySpecialError
> {
  return {
    defaultConfig: {
      doStuff: true,
    },
    matcher: (thrown): thrown is MySpecialError =>
      thrown instanceof MySpecialError,
    handler: (thrown, request, config) => {
      return new KintResponse("An error occurred", 202);
    },
  };
}

const kintWithMiddleware = rootKint
  .preprocessingMiddleware(auth())
  .preprocessingMiddleware(log());

kintWithMiddleware.defineZodEndpoint(
  {
    moduleName: "Test Module",
    requestBody: z.string(),
    urlParams: {
      id: z.number(),
    },
  },
  (input, context, config) => {
    input.underlyingExpressRequest;
    input.urlParams.id;

    return new KintResponse("Hello world!", 200);
  }
);
