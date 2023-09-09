/**
 * @file src/core/cli.ts
 * @description 主命令入口文件
 * @since 1.0.0
 */

import { Command } from "commander";

import dev from "../commands/dev/cli";
import { readPackage } from "../utils/getBaseInfo";

const MuCli = new Command();

// base info
MuCli.name("muc")
  .description(readPackage().description)
  .version(readPackage().version, "-v, --version");

// add sub command
MuCli.addCommand(dev);

export default MuCli;
