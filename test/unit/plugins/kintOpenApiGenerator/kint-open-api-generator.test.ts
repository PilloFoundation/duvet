import path from "path";
import { buildExpressRouter } from "./kint";
import { shouldBeFalse, shouldBeTrue } from "../../../../src/schemaHelpers";
import express from "express";

describe("Should generate a build file", () => {
	const routes = path.join(__dirname, "routes");

	const router = buildExpressRouter(routes, "context");

	const app = express();

	app.use(express.json());
	app.use("/", router);
});
