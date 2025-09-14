import eslintPluginYml from "eslint-plugin-yml";
import eslintParserYml from "yaml-eslint-parser";

const eslintConfigYml = {
  files: ["*.yaml", "*.yml"],
  plugins: { yml: eslintPluginYml },
  languageOptions: {
    parser: eslintParserYml,
    parserOptions: {
      defaultYamlVersion: "1.2",
      extraFileExtensions: [".yaml", ".yml"],
    },
  },
  rules: {
    "yml/indent": ["error", 2],
    "yml/no-multiple-empty-lines": "error",
    "yml/key-spacing": "error",
    "yml/quotes": [
      "error",
      {
        prefer: "double",
        avoidEscape: true,
      },
    ],
    "yml/sort-keys": [
      "error",
      {
        pathPattern: "^rules$",
        order: ["asc"],
      },
    ],
  },
};

export default eslintConfigYml;
