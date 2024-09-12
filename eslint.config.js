import eslintConfigJson from "./eslint/eslint.json.js";
import eslintConfigTs from "./eslint/eslint.ts.js";
import eslintConfigYml from "./eslint/eslint.yml.js";

export default [
  eslintConfigYml,
  eslintConfigTs,
  eslintConfigJson,
  {
    ignores: [
      "node_modules/",
      "pnpm-lock.yaml",
      "dist/",
      "!.vscode/",
      "config/user.yml",
    ],
  },
];
