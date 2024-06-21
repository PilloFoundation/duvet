import { createExpressDuvet } from "express-duvet";

type Context = {
  dbConnection: {
    connect(): void;
  };
};

export const { build, duvet } = createExpressDuvet<Context>();
