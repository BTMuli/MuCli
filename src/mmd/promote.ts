/**
 * @file src/mmd/promote.ts
 * @description mmd 命令-工具函数
 * @since 1.0.0
 */

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
 * @description 创建新的 markdown 文件的提示
 * @function createPromote
 * @param {string} filePath markdown 文件路径
 * @returns {Promise<void>}
 */
export async function createPromote(filePath: string): Promise<void> {
  const filename = handleMarkdownName(filePath);
  if (fs.existsSync(filePath)) {
    const frontmatter = tryGetFrontmatter(filePath);
    if (frontmatter === false) {
      // await insertPromote(filePath);
      console.log("insert");
      return;
    } else {
      await updatePromote(filePath);
      return;
    }
  }
  await inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Title:",
        default: filename,
      },
    ])
    .then(async (answerF) => {
      const label = getLabelByFilename(answerF.title);
      await inquirer
        .prompt([
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
        ])
        .then((answerS) => {
          const spinner = ora("Creating markdown file").start();
          const fileContent = getFrontmatter(
            answerS.author,
            answerS.description,
          );
          fs.createFileSync(filePath);
          fs.writeFileSync(filePath, fileContent);
          spinner.succeed("Markdown file created");
        });
    });
}

/**
 * @description 更新 markdown 文件的 frontmatter 的提示
 * @function updatePromote
 * @param {string} filePath markdown 文件路径
 * @returns {Promise<void>}
 */
export async function updatePromote(filePath: string): Promise<void> {
  const frontmatter = tryGetFrontmatter(filePath);
  if (frontmatter === false) {
    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "create",
          message: "Create frontmatter?",
          default: true,
        },
      ])
      .then(async (answers) => {
        if (answers.create === true) {
          await createPromote(filePath);
        }
      });
  } else {
    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "update",
          message: "Update frontmatter?",
          default: true,
        },
      ])
      .then(async (answers) => {
        if (answers.update === true) {
          const spinner = ora("Updating frontmatter").start();
          const fileContent = getFrontmatter(
            frontmatter.author,
            frontmatter.description,
            frontmatter.create,
          );
          const contentArr = fs.readFileSync(filePath, "utf-8").split("\n");
          contentArr.splice(0, 10, ...fileContent.split("\n"));
          fs.writeFileSync(filePath, contentArr.join("\n"));
          spinner.succeed("Frontmatter updated");
        }
      });
  }
}
