import { Request } from "express";

export type DuvetRequest = {
  underlying: Request;
  response: {
    send(status: number, body: unknown): never;
  };
};
