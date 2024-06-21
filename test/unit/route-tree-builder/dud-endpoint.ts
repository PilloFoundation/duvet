import { DuvetEndpoint } from "../../../src/core/models/DuvetEndpoint";
import { DuvetExport } from "../../../src/core/models/DuvetExport";

export const dudEndpoint: DuvetExport<DuvetEndpoint<unknown, unknown>> = {
  builtByDuvet: true,
  data: {
    config: {},
    exportType: "DuvetEndpoint",
    handler: () => {
      return { body: undefined, status: 200 };
    },
  },
};
