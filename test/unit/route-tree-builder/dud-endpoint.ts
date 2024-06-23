import { DuvetExport } from "../../../src/core/common/DuvetExport";
import { DuvetEndpoint } from "../../../src/core/endpoint-builder/DuvetEndpoint";

export const dudEndpoint: DuvetExport<
  DuvetEndpoint<object, object, unknown, unknown>
> = {
  builtByDuvet: true,
  data: {
    config: {},
    exportType: "DuvetEndpoint",
    handler: () => {
      return { data: undefined, status: 200 };
    },
  },
};
