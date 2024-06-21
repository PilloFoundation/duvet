// @ts-check

import eslint from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";
import noTypeAssertions from "eslint-plugin-no-type-assertion";
import spellcheck from "eslint-plugin-spellcheck";
import skipWords from "./skip-words.js";
import duvet from "@duvetjs/eslint-plugin-duvet";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsdoc.configs["flat/recommended-typescript"],
  {
    plugins: {
      "jsdoc": jsdoc,
      "no-type-assertion": noTypeAssertions,
      "spellcheck": spellcheck,
      "@duvetjs/eslint-plugin-duvet": duvet,
    },
  },
  {
    rules: {
      "@typescript-eslint/ban-types": "warn",
      "no-warning-comments": "warn",
      "no-type-assertion/no-type-assertion": "warn",
      "spellcheck/spell-checker": [
        1,
        {
          skipWords,
        },
      ],
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
