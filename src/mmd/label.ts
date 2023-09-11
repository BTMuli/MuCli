/**
 * @file src/mmd/label.ts
 * @description mmd 命令-label 相关
 * @since 1.0.0
 */

import assert from "assert";

import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import YAML from "yamljs";

import { getConfigPath } from "../utils/getBaseInfo";
import { getConfig } from "../utils/loadConfig";

/**
 * @description label 操作中转
 * @function labelTransfer
 * @since 1.0.0
 * @returns {Promise<void>}
 */
export async function labelTransfer(): Promise<void> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want to do about label?",
      choices: [
        {
          name: "See all labels",
          value: "see",
        },
        {
          name: "Create a new label",
          value: "create",
        },
        {
          name: "Update a label",
          value: "update",
        },
        {
          name: "Delete label(s)",
          value: "delete",
        },
        {
          name: "Do nothing",
          value: "nothing",
        },
      ],
    },
  ]);
  switch (answer.type) {
    case "see":
      await seeLabel();
      break;
    case "create":
      await createLabel();
      break;
    case "update":
      await updateLabel();
      break;
    case "delete":
      await deleteLabel();
      break;
    case "nothing":
      break;
  }
}

/**
 * @description 输入 label，输出终端显示的 label
 * @function getLabel
 * @since 1.0.0
 * @param {MUCLI.Config.MmdLabel} label label
 * @returns {string}
 */
function getLabel(label: MUCLI.Config.MmdLabel): string {
  return `[filename] ${chalk.yellow(label.filename)} [author] ${chalk.yellow(
    label.author,
  )} [description] ${chalk.yellow(label.description)}`;
}

/**
 * @description 查看所有 label
 * @function seeLabel
 * @since 1.0.0
 * @returns {Promise<void>}
 */
async function seeLabel(): Promise<void> {
  const config = getConfig();
  const defaultLabel = config.mmd.defaultLabel;
  console.log(chalk.green("Default label:"), getLabel(defaultLabel));
  const labels = config.mmd.labels;
  console.log(chalk.green("Custom labels:"));
  if (labels.length === 0) {
    console.log(chalk.yellow("\tNo custom labels"));
    return;
  }
  for (const label of labels) {
    console.log("\t", getLabel(label));
  }
}

/**
 * @description 创建 label
 * @function createLabel
 * @since 1.0.0\
 * @param {string} filename 文件名
 * @returns {Promise<void>}
 */
async function createLabel(filename?: string): Promise<void> {
  const config = getConfig();
  const labels = config.mmd.labels;
  const labelDefault = config.mmd.defaultLabel;
  const answerF = await inquirer.prompt([
    {
      type: "input",
      name: "filename",
      message: "Filename:",
      default: filename ?? "",
    },
  ]);
  if (
    answerF === labelDefault.filename ||
    labels.some((label) => label.filename === answerF.filename)
  ) {
    if (answerF.filename === labelDefault.filename) {
      // todo 后续能够变更默认 label
      ora("The label is already exists as the default label!").fail();
    }
    const labelFind = labels.find(
      (label) => label.filename === answerF.filename,
    );
    if (labelFind === undefined) return;
    const answerS = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `The label already exists, do you want to update the label ?\n${getLabel(
          labelFind,
        )}`,
      },
    ]);
    if (answerS.confirm === false) {
      return;
    }
    await updateLabel(answerF.filename);
  } else {
    const answerS = await inquirer.prompt([
      {
        type: "input",
        name: "author",
        message: "Author:",
      },
      {
        type: "input",
        name: "description",
        message: "Description:",
      },
    ]);
    const newLabel = {
      filename: answerF.filename,
      author: answerS.author,
      description: answerS.description,
    };
    const answerT = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Do you want to create the label ?\n${getLabel(newLabel)}`,
      },
    ]);
    if (answerT.confirm === false) {
      return;
    }
    labels.push(newLabel);
    config.mmd.labels = labels;
    fs.writeFileSync(getConfigPath(), YAML.stringify(config, 4, 2));
  }
}

/**
 * @description 更新 label
 * @function updateLabel
 * @since 1.0.0
 * @param {string} filename - label 的文件名
 * @param {boolean} isDefault - 是否是默认 label // todo，后续可以更改
 * @returns {Promise<void>}
 */
export async function updateLabel(
  filename?: string,
  isDefault: boolean = false,
): Promise<void> {
  const answerF = await inquirer.prompt([
    {
      type: "input",
      name: "input",
      message: "Please input the filename of the label you want to update:",
      default: filename ?? "",
    },
  ]);
  // todo 对于默认 label 的处理
  const labels = getConfig().mmd.labels;
  const labelFind = labels.find((label) => (label.filename = answerF.input));
  if (labels.length === 0 || labelFind === undefined) {
    const answerS = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "The label is not exist yet, create a new ?",
        default: true,
      },
    ]);
    if (answerS.confirm === false) return;
    await createLabel(answerF.input);
  } else {
    assert(labelFind !== undefined);
    const answerS = await inquirer.prompt([
      {
        type: "input",
        name: "author",
        message: "Author: ",
        default: labelFind.author,
      },
      {
        type: "input",
        name: "description",
        message: "Description: ",
        default: labelFind.description,
      },
    ]);
    const newLabel = {
      filename: answerF.input,
      author: answerS.author,
      description: answerS.description,
    };
    const answerT = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure to update ?\n\tOld: ${getLabel(
          labelFind,
        )}\n\tNew:${getLabel(newLabel)}`,
      },
    ]);
    if (answerT === false) return;
    // 替换
    labels.forEach((label) => {
      if (label.filename === answerF.input) {
        label = newLabel;
      }
    });
    const config = getConfig();
    config.mmd.labels = labels;
    fs.writeFileSync(getConfigPath(), YAML.stringify(config, 4, 2));
  }
}

/**
 * @description 删除 label
 * @function deleteLabel
 * @since 1.0.0
 * @returns {Promise<void>}
 */
export async function deleteLabel(): Promise<void> {
  const labels = getConfig().mmd.labels;
  if (labels.length === 0) {
    ora("No custom labels").fail();
    return;
  }
  const choices = labels.map((label) => {
    return {
      name: label.filename,
      value: label.filename,
      checked: false,
    };
  });
  const answerF = await inquirer.prompt([
    {
      type: "checkbox",
      name: "filename",
      message: "Which label(s) do you want to delete ?",
      choices,
    },
  ]);
  const answerS = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure to delete these labels ?",
    },
  ]);
  if (answerS.confirm === false) return;
  const newLabels: MUCLI.Config.MmdLabel[] = [];
  labels.forEach((label) => {
    if (answerF.filename.includes(label.filename) === false) {
      newLabels.push(label);
    }
  });
  const config = getConfig();
  config.mmd.labels = newLabels;
  fs.writeFileSync(getConfigPath(), YAML.stringify(config, 4, 2));
  ora("Delete successfully").succeed();
}
