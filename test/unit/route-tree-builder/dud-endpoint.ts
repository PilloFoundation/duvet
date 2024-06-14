import { KintEndpointMeta } from "../../../src/core/models/KintEndpointMeta";
import { KintExport } from "../../../src/core/models/KintExport";

export const dudEndpoint: KintExport<KintEndpointMeta> = {
  builtByKint: true,
  data: {
    config: {},
    data: "KintEndpointMeta",
    handler: () => {
      return { body: undefined, status: 200 };
    },
  },
};
