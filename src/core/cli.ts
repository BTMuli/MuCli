/**
 * @file src/core/cli.ts
 * @description 主命令入口文件
 * @since 1.0.0
 */

import { exec } from "child_process";

import axios from "axios";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";

import { readPackage } from "../utils/getBaseInfo";
import { changeSubCommandEnable, getOnSubCommands } from "../utils/loadConfig";

const MuCli = new Command();
const version = readPackage().version;

// base info
MuCli.name("muc")
  .description(readPackage().description)
  .version(version, "-v, --version");

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

// commands that automatically run before other commands to check the version is the latest
MuCli.command("update")
  .description("check and update from upstream")
  .action(async () => {
    const spinnerF = ora("Checking update...").start();
    const res: MUCLI.Npm.CheckPackage = (
      await axios.get("https://registry.npmjs.org/@btmuli/mucli")
    ).data;
    const versionGet = res["dist-tags"].latest;
    if (version < versionGet) {
      spinnerF.stop();
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "update",
          message: `There is a new version ${chalk.blue(versionGet)}, update?`,
          default: true,
        },
      ]);
      if (answer.update === true) {
        const spinnerS = ora("Updating...").start();
        exec("npm i -g @btmuli/mucli", (err, stdout, stderr) => {
          let message = "";
          if (err !== null) message = err.message;
          if (stderr !== null && stderr !== "") {
            message = message === "" ? stderr : `${message}\n${stderr}`;
          }
          if (message !== "") {
            message = `Updated failed\n${chalk.red(message, stdout)}`;
            spinnerS.fail(message);
          } else {
            message = "Updated successfully";
            spinnerS.succeed(message);
          }
          spinnerS.stop();
        });
      }
    } else {
      spinnerF.succeed("MuCli is latest!");
    }
  });

export default MuCli;
