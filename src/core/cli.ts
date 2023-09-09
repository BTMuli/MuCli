/**
 * @file src/core/cli.ts
 * @description 主命令入口文件
 * @since 1.0.0
 */

import { Command } from "commander";
import inquirer from "inquirer";

import { readPackage } from "../utils/getBaseInfo";
import { changeSubCommandEnable, getOnSubCommands } from "../utils/loadConfig";

const MuCli = new Command();

// base info
MuCli.name("muc")
  .description(readPackage().description)
  .version(readPackage().version, "-v, --version");

// command for set subcommand on or off
MuCli.command("set")
  .description("set subcommand on or off")
  .action(async () => {
    const commandList = ["dev", "mmd"];
    const onCommandList = getOnSubCommands();
    const choices = commandList.map((command) => {
      if (onCommandList.includes(command)) {
        return {
          name: command,
          value: command,
          checked: true,
        };
      }
      return {
        name: command,
        value: command,
        checked: false,
      };
    });
    await inquirer
      .prompt([
        {
          type: "checkbox",
          name: "command",
          message: "Please select the subcommand you want to open",
          choices,
        },
      ])
      .then(async (answers) => {
        changeSubCommandEnable(answers.command);
      });
  });

export default MuCli;
