/**
 * @file src/pip/cli.ts
 * @description pip 命令-入口文件
 * @since 1.5.0
 * @version 1.0.1
 */

import { exec } from "child_process";

import { Command } from "commander";

import { getSubVersion } from "../utils/getBaseInfo";

const pip = new Command("pip");
const version = getSubVersion("pip");

// base info
pip
  .name("pip")
  .description("A cli tool for pip")
  .version(version, "-s, --subversion");

// command for mirror
pip
  .command("mirror")
  .description("mirror crud")
  .action(async () => {
    console.log("mirror");
  });

// command for package install
pip
  .command("install [pkg]")
  .description("install package")
  .action(async (pkg) => {
    if (pkg === undefined) {
      // default search requirements.txt
      console.log("search requirements.txt");
      return;
    }
    const mirror = "https://pypi.tuna.tsinghua.edu.cn/simple";
    exec(`pip install ${pkg} -i ${mirror}`, (err, stdout, stderr) => {
      if (err !== null && err !== undefined) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
  });

export default pip;
