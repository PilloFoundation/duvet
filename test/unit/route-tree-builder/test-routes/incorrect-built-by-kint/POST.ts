// Testing a object that is built by kint but is not a KintEndpoint. But is placed in a file that is picked up as a kint endpoint

export default {
  builtByKint: true,
  data: {
    exportType: "NotAKintEndpoint",
  },
};
