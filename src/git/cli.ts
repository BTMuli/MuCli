/**
 * @file src/git/cli.ts
 * @description git 命令-入口文件
 * @since 1.5.0
 * @version 1.0.1
 */
import { Command } from "commander";
import { getSubVersion } from "../utils/getBaseInfo";
import { getProxyCommand } from "./utils";
import { execSync } from "child_process";

const git = new Command("git");
const version = getSubVersion("git");

// base info
git
  .name("git")
  .description("A cli tool for git")
  .version(version, "-s, --subversion");

interface GitProxyOptions {
  url: string | undefined;
  target: string | undefined;
}

// command for set proxy
git
  .command("proxy")
  .description("set git proxy")
  .option("-u, --url <url>", "The proxy URL")
  .option("-t, --target <target>", "The target proxy status of Git")
  .action(async (opt: GitProxyOptions) => {
    const targetStatus =
      opt.target === undefined ? true : opt.target === "true";
    const proxyUrl = opt.url ?? "127.0.0.1:7890";
    const commands = [
      getProxyCommand(proxyUrl, targetStatus, true),
      getProxyCommand(proxyUrl, targetStatus, false),
    ];
    for (const command of commands) {
      execSync(command);
    }
    console.log(`success to ${targetStatus ? "set" : "unset"} git proxy`);
  });

export default git;
