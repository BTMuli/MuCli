/**
 * @file src/commands/mmd/cli.ts
 * @description mmd 命令-入口文件
 * @since 1.0.0
 */

import { Command } from "commander";

import { SubCommand, getSubVersion } from "../../utils/getBaseInfo";

const mmd = new Command("mmd");
const version = getSubVersion(SubCommand.mmd);

// base info
mmd
  .name("mmd")
  .description("A cli tool for markdown")
  .version(version, "-sv, --subversion");

export default mmd;
