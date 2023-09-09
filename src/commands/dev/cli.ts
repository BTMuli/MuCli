/**
 * @file src/commands/dev/cli.ts
 * @description dev 命令-入口文件
 * @since 1.0.0
 */

import { exec } from "child_process";

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import ora from "ora";
import YAML from "yamljs";

import {
  SubCommand,
  getConfigPath,
  getRootPath,
  getScripts,
  getSubVersion,
} from "../../utils/getBaseInfo";

const dev = new Command("dev");
const version = getSubVersion(SubCommand.dev);

// base info
dev
  .name("dev")
  .description("A cli tool for devtools")
  .version(version, "-sv, --subversion");

// command for run pnpm script
dev
  .command("run [script]")
  .description("run pnpm script")
  .action(async (script) => {
    let option = "build";
    const scripts = getScripts();
    if (script !== undefined) {
      if (scripts.includes(script)) {
        option = script;
      } else {
        ora(`Scripts: ${chalk.blue(script)} not found`).fail();
        return;
      }
    }
    const cmd = `pnpm ${option}`;
    const spinner = ora(`Running scripts: ${chalk.blue(cmd)}`).start();
    exec(`pnpm ${option}`, { cwd: getRootPath() }, (err, stdout, stderr) => {
      let message = "";
      if (err !== null) message = err.message;
      if (stderr !== null) message = stderr;
      if (err !== null) {
        if (message === "") message = stdout;
        message = `Scripts: ${chalk.blue(cmd)} run failed\n${chalk.red(
          message,
        )}`;
        spinner.fail(message);
      } else {
        message = `Scripts: ${chalk.blue(cmd)} successfully`;
        spinner.succeed(message);
      }
      spinner.stop();
    });
  });

// command for update config file
dev
  .command("update")
  .description("update config file")
  .action(() => {
    const configPath = getConfigPath(true);
    const config: MUCLI.Config.FullInfo = YAML.load(configPath);
    config.update = Math.floor(Date.now() / 1000);
    fs.writeFileSync(configPath, YAML.stringify(config, 4, 2));
  });

export default dev;
