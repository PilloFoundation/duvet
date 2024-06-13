import { rootKint } from "../rootKint";

export default rootKint.defineEndpoint(
  {
    middlewareC: "Test",
    catch: { source: "Testing endpoint" },
  },
  (request, context) => {
    console.log("running endpoint!");

    console.log("context: ", context);

    throw new Error("Test error");

    context.global.dbConnection;

    return {
      body: "Hello world!",
      status: 200,
    };
  }
);
