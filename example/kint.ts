import { createExpressKint } from "../src";

type Context = {
  dbConnection: {
    connect(): void;
  };
};

export const { build, kint } = createExpressKint<Context>();
