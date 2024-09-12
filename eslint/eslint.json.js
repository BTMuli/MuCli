import eslintPluginJson from "eslint-plugin-jsonc";
import eslintParserJson from "jsonc-eslint-parser";

const eslintConfigJson = {
  files: ["*.json"],
  plugins: { jsonc: eslintPluginJson },
  languageOptions: { parser: eslintParserJson },
  rules: {
    "jsonc/sort-array-values": [
      "error",
      {
        pathPattern: ".*",
        order: { type: "asc" },
      },
    ],
    "jsonc/sort-keys": [
      "error",
      {
        pathPattern: "^$",
        order: [
          "name",
          "version",
          "description",
          "packageManager",
          "subVersion",
          "scripts",
          "type",
          "bin",
          "lint_staged",
          "keywords",
          "author",
          "license",
          "repository",
          "homepage",
          "bugs",
          "dependencies",
          "devDependencies",
        ],
      },
      {
        pathPattern: "settings",
        order: { type: "asc" },
      },
    ],
  },
};

export default eslintConfigJson;
