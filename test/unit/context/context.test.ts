import path from "path";
import request from "supertest";
import express, { type Express } from "express";
import { buildRouter } from "./kint";
import { expressRouterBuilder } from "../../../src/defaultRouterBuilders/expressRouterBuilder";

describe("Kint user flow", () => {
	test("Builder works correctly", async () => {
		const routes = path.join(__dirname, "routes");

		const context = { a: "initialA", b: 0 };

		const router = buildRouter(routes, context, expressRouterBuilder());

		const test = await request(router).get("/").expect(200);

		expect(context.a).toBe("setA");
		expect(context.b).toBe(25);
	});
});
