import path from "path";
import request from "supertest";
import express, { type Express } from "express";
import { buildRouter } from "./kint";
import { expressAppBuilder } from "../../../src/defaultRouterBuilders/expressAppBuilder";

describe("Kint user flow", () => {
	test("Builder works correctly with default builder", async () => {
		const routes = path.join(__dirname, "routes");

		const context = { a: "initialA", b: 0 };

		const router = buildRouter(routes, context);

		const test = await request(router).get("/").expect(200);

		expect(context.a).toBe("setA");
		expect(context.b).toBe(25);
	});
	test("Builder works correctly with provided builder", async () => {
		const routes = path.join(__dirname, "routes");

		const context = { a: "initialA", b: 0 };

		const router = buildRouter(routes, context, expressAppBuilder());

		const test = await request(router).get("/").expect(200);

		expect(context.a).toBe("setA");
		expect(context.b).toBe(25);
	});
});
