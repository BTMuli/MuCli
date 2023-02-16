/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description rollup config
 * @version 0.7.0
 */

/* Node */
import typescript from "typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript2 from "rollup-plugin-typescript2";
import { dependencies } from "./package.json";

const external = Object.keys(dependencies || "");
const globals = external.reduce((prev, current) => {
	const newPrev = prev;

	newPrev[current] = current;
	return newPrev;
}, {});

const defaultConfig = {
	input: "./src/index.ts",
	output: {
		file: "./dist/index.js",
		format: "esm",
		banner: "#!/usr/bin/env node",
		globals,
	},
	external,
	plugins: [
		nodeResolve({
			extensions: [".js", ".ts"],
		}),
		typescript2({
			exclude: "node_modules/**",
			useTsconfigDeclarationDir: true,
			typescript,
			tsconfig: "./tsconfig.json",
		}),
		json(),
		terser(),
	],
};

export default defaultConfig;
