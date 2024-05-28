import path from "path";
import { kint } from "./kint";
import express from "express";

const routes = path.join(__dirname, "routes");

const context = { dbConnection: { connect: () => {} } };

const router = kint.buildExpressRouter(routes, context);

const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
