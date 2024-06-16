import path from "path";
import request from "supertest";
import express from "express";
import { Context } from "./Context";
import { build } from "./kint";

describe("Params", () => {
  test("Handler validates and returns number param passed to endpoint", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    const response = await request(app).get("/123456").expect(200);

    expect(response.text).toBe("123456");
  });

  test("Handler validates and rejects incorrect param passed to endpoint ", async () => {
    const routes = path.join(__dirname, "routes");

    const context: Context = { a: "N/A", b: 0 };

    const router = build(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    await request(app).get("/test_value").expect(500); // TODO: Have response give a nicer error message
  });
});
