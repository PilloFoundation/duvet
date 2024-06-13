import { rootKint } from "../rootKint";

export default rootKint.defineEndpoint(
  {
    logging: {
      module: "TEST",
    },
    auth: {
      method: "bearer",
    },
  },
  (_req, k) => {
    console.log("running endpoint!");

    console.log("Got token: " + k.auth.token);

    return {
      body: "Hello world!",
      status: 200,
    };
  }
);
