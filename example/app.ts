import path from "path";
import express from "express";

import { build } from "./kint";

const routes = path.join(__dirname, "routes");

const context = { dbConnection: { connect: () => {} } };

const router = build(routes, context);

const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
