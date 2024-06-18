import { createExpressKint } from "express-kint";

type Context = {
  dbConnection: {
    connect(): void;
  };
};

export const { build, kint } = createExpressKint<Context>();
