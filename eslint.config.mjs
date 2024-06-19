// @ts-check

import eslint from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";
import noTypeAssertions from "eslint-plugin-no-type-assertion";
import kintLint from "@pkwadsy/eslint-plugin-kint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...kintLint.configs.recommended,
  jsdoc.configs["flat/recommended-typescript"],
  {
    plugins: { jsdoc, "no-type-assertion": noTypeAssertions },
  },
  {
    rules: {
      "@typescript-eslint/ban-types": "warn",
      "no-warning-comments": "warn",
      "no-type-assertion/no-type-assertion": "warn",
    },
  },
  {
    extends: [
      {
        ignores: ["dist/*", "*.js", "*.mjs"],
      },
    ],
  },
  {
    files: ["test/**/*.test.ts"],
    rules: {
      "no-type-assertion/no-type-assertion": "off",
      "jsdoc/require-jsdoc": "off",
    },
  },
);
