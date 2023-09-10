/**
 * @file src/mmd/promote.ts
 * @description mmd 命令-工具函数
 * @since 1.0.0
 */

import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";

import {
  getFrontmatter,
  getLabelByFilename,
  handleMarkdownName,
  tryGetFrontmatter,
} from "./utils";

/**
 * @description 获取 markdown 文件的 frontmatter 的提示
 * @function getPromote
 * @since 1.0.0
 * @param {string} filePath markdown 文件路径
 * @returns {Promise<MUCLI.Config.MmdLabel>}
 */
export async function getPromote(
  filePath: string,
): Promise<MUCLI.Config.MmdLabel> {
  const filename = handleMarkdownName(filePath);
  const answerF = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Title:",
      default: filename,
    },
  ]);
  const label = getLabelByFilename(answerF.title);
  const answerS = await inquirer.prompt([
    {
      type: "input",
      name: "author",
      message: "Author:",
      default: label.author,
    },
    {
      type: "input",
      name: "description",
      message: "Description:",
      default: label.description,
    },
  ]);
  return {
    filename: answerF.title,
    author: answerS.author,
    description: answerS.description,
  };
}

/**
 * @description 创建新的 markdown 文件的提示
 * @function createPromote
 * @since 1.0.0
 * @param {string} filePath markdown 文件路径
 * @returns {Promise<void>}
 */
export async function createPromote(filePath: string): Promise<void> {
  const filename = handleMarkdownName(filePath);
  if (fs.existsSync(filePath)) {
    const frontmatter = tryGetFrontmatter(filePath);
    const choices = [
      {
        name: "Create new file",
        value: "create",
      },
    ];
    if (frontmatter !== false) {
      choices.unshift({
        name: "Update frontmatter",
        value: "update",
      });
    } else {
      choices.unshift({
        name: "Insert frontmatter",
        value: "insert",
      });
    }
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: `File ${chalk.yellow(
          filename,
        )} already exists, what do you want to do?`,
        choices,
        default: frontmatter === false ? "insert" : "update",
      },
    ]);
    switch (answer.action) {
      case "update":
        await updatePromote(filePath);
        return;
      case "insert":
        await insertPromote(filePath);
        return;
      case "create":
        break;
    }
  }
  const label = await getPromote(filePath);
  const spinner = ora("Creating markdown file").start();
  const fileContent = getFrontmatter(label.author, label.description);
  fs.createFileSync(filePath);
  fs.writeFileSync(filePath, fileContent);
  spinner.succeed("Markdown file created");
}

/**
 * @description 更新 markdown 文件的 frontmatter 的提示
 * @function updatePromote
 * @since 1.0.0
 * @param {string} filePath markdown 文件路径
 * @returns {Promise<void>}
 */
export async function updatePromote(filePath: string): Promise<void> {
  const filename = handleMarkdownName(filePath);
  const frontmatter = tryGetFrontmatter(filePath);
  if (frontmatter === false) {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "create",
        message: `Frontmatter not found in ${chalk.yellow(filename)}, create?`,
        default: true,
      },
    ]);
    if (answer.create === true) {
      await createPromote(filePath);
    }
  } else {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "update",
        message: `Frontmatter found in ${chalk.yellow(filename)}, update?`,
        default: true,
      },
    ]);
    if (answer.update === true) {
      const spinner = ora("Updating frontmatter").start();
      const fileContent = getFrontmatter(
        frontmatter.author,
        frontmatter.description,
        frontmatter.create,
      );
      const contentArr = fs.readFileSync(filePath, "utf-8").split("\n");
      contentArr.splice(0, 11, ...fileContent.split("\n"));
      fs.writeFileSync(filePath, contentArr.join("\n"));
      spinner.succeed("Frontmatter updated");
    }
  }
}

/**
 * @description 插入 markdown 文件的 frontmatter 的提示
 * @function insertPromote
 * @since 1.0.0
 * @param {string} filePath markdown 文件路径
 * @returns {Promise<void>}
 */
export async function insertPromote(filePath: string): Promise<void> {
  const label = await getPromote(filePath);
  const spinner = ora("Inserting frontmatter").start();
  const fileContent = getFrontmatter(label.author, label.description);
  const contentArr = fs.readFileSync(filePath, "utf-8").split("\n");
  contentArr.splice(0, 0, ...fileContent.split("\n"));
  fs.writeFileSync(filePath, contentArr.join("\n"));
  spinner.succeed("Frontmatter inserted");
}
