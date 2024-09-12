import eslintPluginJs from "@eslint/js";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTypescript from "typescript-eslint";
import eslintParserTypescript from "@typescript-eslint/parser";

export default {
  files: ["*.ts"],
  plugins: {
    js: eslintPluginJs,
    typescript: eslintPluginTypescript,
    import: eslintPluginImport,
    prettier: eslintPluginPrettier,
  },
  languageOptions: {
    parser: eslintParserTypescript,
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
      },
    ],
    "@typescript-eslint/consistent-type-definitions": [
      "error",
      "angle-bracket",
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "unknown",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
