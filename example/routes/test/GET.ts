import { rootKint } from "../rootKint";

export default rootKint.defineEndpoint(
  {
    middlewareC: "Test",
    catch: null,
  },
  (request, context) => {
    console.log("running endpoint!");

    console.log("context: ", context);

    context.global.dbConnection;

    return {
      body: "Hello world!",
      status: 200,
    };
  }
);
