/**
 * @file src/index.ts
 * @description 入口文件
 * @since 1.0.0
 */

import process from "process";

import dev from "./commands/dev/cli";
import mmd from "./commands/mmd/cli";
import MuCli from "./core/cli";
import { mountSubCommand } from "./utils/loadConfig";

mountSubCommand(MuCli, [mmd, dev]);

MuCli.parse(process.argv);
