/**
 * @file src/index.ts
 * @description 入口文件
 * @since 1.4.0
 */

import process from "process";

import MuCli from "./core/cli";
import dev from "./dev/cli";
import git from "./git/cli";
import mmd from "./mmd/cli";
import pip from "./pip/cli";
import rs from "./rs/cli";
import { mountSubCommand } from "./utils/loadConfig";

mountSubCommand(MuCli, [mmd, git, dev, pip, rs]);

MuCli.parse(process.argv);
