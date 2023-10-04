/**
 * @file src/index.ts
 * @description 入口文件
 * @since 1.2.0
 */

import process from "process";

import MuCli from "./core/cli";
import dev from "./dev/cli";
import mmd from "./mmd/cli";
import pip from "./pip/cli";
import { mountSubCommand } from "./utils/loadConfig";

mountSubCommand(MuCli, [mmd, dev, pip]);

MuCli.parse(process.argv);
