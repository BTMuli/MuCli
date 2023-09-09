/**
 * @file src/index.ts
 * @description 入口文件
 * @since 1.0.0
 */

import process from "process";

import MuCli from "./core/cli";

MuCli.parse(process.argv);
