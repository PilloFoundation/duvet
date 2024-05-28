import path from "path";
import request from "supertest";
import express from "express";
import { kint } from "./kint";

describe("Kint user flow", () => {
  test("Builder works correctly", async () => {
    const routes = path.join(__dirname, "routes");

    const context = { a: "initialA", b: 0 };

    const router = kint.buildExpressRouter(routes, context);

    const app = express();

    app.use(express.json());
    app.use("/", router);

    const test = await request(app).get("/").expect(200);

    expect(context.a).toBe("setA");
    expect(context.b).toBe(25);
  });
});
