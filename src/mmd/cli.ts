/**
 * @file src/mmd/cli.ts
 * @description mmd 命令-入口文件
 * @since 1.5.0
 * @version 1.2.1
 */

import { Command } from "commander";

import { labelTransfer } from "./label";
import { createPromote, updatePromote } from "./promote";
import { handleMarkdownPath } from "./utils";
import { getSubVersion } from "../utils/getBaseInfo";

const mmd = new Command("mmd");
const version = getSubVersion("mmd");

// base info
mmd
  .name("mmd")
  .description("A cli tool for markdown")
  .version(version, "-s, --subversion");

// command for label crud
mmd
  .command("label")
  .description("label crud")
  .action(async () => {
    await labelTransfer();
  });

// command for markdown create
mmd
  .command("new [name]")
  .description("create markdown file")
  .action(async (name: string | undefined) => {
    const filepath = handleMarkdownPath(name);
    await createPromote(filepath);
  });

// command for update markdown frontmatter
mmd
  .command("update [name]")
  .description("update markdown frontmatter")
  .action(async (name: string | undefined) => {
    const filepath = handleMarkdownPath(name);
    await updatePromote(filepath);
  });

export default mmd;
