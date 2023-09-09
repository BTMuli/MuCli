/**
 * @file src/commands/dev/cli.ts
 * @description dev 命令-入口文件
 * @since 1.0.0
 */

import { exec } from "child_process";

import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";

import { getRootPath } from "../../utils/getBaseInfo";

const dev = new Command("dev");

// base info
dev
  .name("dev")
  .description("A cli tool for devtools")
  .version("1.0.0", "-sv, --subversion");

// command for run pnpm script
dev
  .command("run [script]")
  .description("run pnpm script")
  .action(async (script) => {
    let option = "build";
    if (script !== undefined) option = script;
    const cmd = `pnpm ${option}`;
    const spinner = ora(`Running scripts: ${chalk.blue(cmd)}`).start();
    exec(`pnpm ${option}`, { cwd: getRootPath() }, (err, _stdout, stderr) => {
      let message = "";
      if (err !== null) message = err.message;
      if (stderr !== null) message = stderr;
      if (err !== null) {
        if (message === "") message = _stdout;
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

export default dev;
