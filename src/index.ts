/**
 * @file src/index.ts
 * @description 入口文件
 * @since 1.0.0
 */

import process from "process";

import MuCli from "./core/cli";
import dev from "./dev/cli";
import mmd from "./mmd/cli";
import { mountSubCommand } from "./utils/loadConfig";

mountSubCommand(MuCli, [mmd, dev]);

MuCli.parse(process.argv);
