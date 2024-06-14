// @ts-check

import eslint from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsdoc.configs["flat/recommended-typescript"],
  {
    plugins: { jsdoc },
  },
  {
    rules: {
      "@typescript-eslint/ban-types": "off",
      "no-warning-comments": "warn",
    },
  },
  {
    extends: [
      {
        ignores: ["dist/*", "*.js", "*.mjs"],
      },
    ],
  },
);
