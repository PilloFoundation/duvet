import kint from '../../../src/index';

const { buildExpressRouter, makeExpressEndpoint } = kint<'context'>();

export const buildRouter = buildExpressRouter;
export default makeExpressEndpoint;
