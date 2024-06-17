import { KintEndpoint } from "../../../src/core/models/KintEndpoint";
import { KintExport } from "../../../src/core/models/KintExport";

export const dudEndpoint: KintExport<KintEndpoint<unknown, unknown>> = {
  builtByKint: true,
  data: {
    config: {},
    exportType: "KintEndpoint",
    handler: () => {
      return { body: undefined, status: 200 };
    },
  },
};
