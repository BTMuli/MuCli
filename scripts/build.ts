/**
 * @file scripts/build.ts
 * @description 构建脚本
 * @since 1.0.0
 */

import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import fs from "fs-extra";
import {
  type OutputOptions,
  rollup,
  type InputOptionsWithPlugins,
} from "rollup";
import typescript2 from "rollup-plugin-typescript2";
import typescript from "typescript";

const dependencies: Record<string, string> =
  fs.readJSONSync("./package.json").dependencies;
const external: string[] = Object.keys(dependencies);
const globals = external.reduce((prev, curr) => {
  const newPre: Record<string, string> = prev;
  newPre[curr] = curr;
  return newPre;
}, {});

const inputOptions: InputOptionsWithPlugins = {
  external,
  input: "src/index.ts",
  plugins: [
    nodeResolve({ extensions: [".js", ".ts"] }),
    typescript2({
      exclude: ["node_modules/**"],
      useTsconfigDeclarationDir: true,
      typescript,
      tsconfig: "./tsconfig.json",
    }),
    json(),
    terser(),
  ],
};

const outputOptions: OutputOptions = {
  file: "dist/index.js",
  format: "esm",
  esModule: true,
  banner: "#!/usr/bin/env node",
  globals,
};

async function build(): Promise<void> {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
}

build()
  .then(() => {
    console.log("build success");
  })
  .catch((err) => {
    console.log("build error", err);
  });
