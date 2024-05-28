import { KintResponse } from "../src/core/models/KintResponse";
import { createKint } from "../src/core/createKint";
import { z } from "zod";
import { auth } from "./middleware/auth";
import { log } from "./middleware/log";

type Context = {
  dbConnection: {
    connect(): void;
  };
};

export const kint = createKint<Context>().preprocessingMiddleware(log());
