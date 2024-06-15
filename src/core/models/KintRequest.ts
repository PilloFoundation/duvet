import { Request } from "express";

export type KintRequest = {
  underlying: Request;
  response: {
    send(status: number, body: unknown): never;
  };
};
