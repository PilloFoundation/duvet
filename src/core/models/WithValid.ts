export type WithValid<Context, Body, Params> = Context & {
  valid: { body: Body; params: Params };
};
