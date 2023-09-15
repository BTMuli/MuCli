/**
 * @file src/mmd/utils.ts
 * @description mmd 命令-工具函数
 * @since 1.1.1
 */

import { resolve } from "path";

import fs from "fs-extra";

import { getRootPath } from "../utils/getBaseInfo";
import { getConfig } from "../utils/loadConfig";

/**
 * @description 获取时间， YYYY-MM-DD || YYYY-MM-DD HH:mm:ss
 * @function getDate
 * @since 1.0.0
 * @param {boolean} full 是否返回完整时间
 * @returns {string} 时间
 */
export function getDate(full?: boolean): string {
  const dateNow = new Date();
  const year = dateNow.getFullYear().toString().padStart(4, "0");
  const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
  const date = dateNow.getDate().toString().padStart(2, "0");
  const hour = dateNow.getHours().toString().padStart(2, "0");
  const minute = dateNow.getMinutes().toString().padStart(2, "0");
  const second = dateNow.getSeconds().toString().padStart(2, "0");
  if (full === true) {
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }
  return `${year}-${month}-${date}`;
}

/**
 * @description 处理 markdown 文件路径
 * @since 1.0.0
 * @param {string} filepath markdown 文件路径
 * @returns {string} markdown 文件路径
 */
export function handleMarkdownPath(filepath?: string): string {
  let fullPath = "./README.md";
  if (filepath !== undefined) {
    fullPath = filepath.endsWith(".md") ? filepath : (filepath += ".md");
  }
  return fullPath;
}

/**
 * @description 处理 markdown 文件名
 * @since 1.0.0
 * @param {string} filepath markdown 文件路径
 * @returns {string} markdown 文件名
 */
export function handleMarkdownName(filepath: string): string {
  let filename: string;
  if (filepath.includes("\\")) {
    filename = <string>filepath.split("\\").pop();
  } else if (filepath.includes("/")) {
    filename = <string>filepath.split("/").pop();
  } else {
    filename = filepath;
  }
  return filename;
}

/**
 * @description 获取 markdown 文件的 frontmatter
 * @since 1.1.1
 * @param {string} author markdown 文件作者
 * @param {string} description markdown 文件描述
 * @returns {string} frontmatter
 */
export function getFrontmatter(
  author: string,
  description: string,
  create?: string,
): string {
  const templatePath = resolve(getRootPath(), "template", "MuCli", "README.md");
  const template = fs.readFileSync(templatePath, "utf-8");
  const date = getDate(false);
  const datefull = getDate(true);
  // 按行分割
  const templateArr = template.split("\n");
  // 根据行数处理
  templateArr.forEach((item, index) => {
    let res;
    if (index === 1) {
      res = item.replace("author", author);
      templateArr[index] = res;
    }
    if (index === 2) {
      res = item.replace("description", description);
      templateArr[index] = res;
    }
    if (index === 4) {
      res = item.replace("update", date);
      templateArr[index] = res;
    }
    if (index === 9) {
      res = item.replace("modify", datefull);
      templateArr[index] = res;
    }
    if (index === 7) {
      if (create !== undefined) {
        res = item.replace("create", create);
      } else {
        res = item.replace("create", datefull);
      }
      templateArr[index] = res;
    }
    if (index === 3) {
      if (create !== undefined) {
        const dateCreate = create.split(" ")[0];
        res = item.replace("date", dateCreate);
      } else {
        res = item.replace("date", date);
      }
      templateArr[index] = res;
    }
  });
  return templateArr.join("\n");
}

/**
 * @description 尝试读取 markdown 文件的 frontmatter
 * @since 1.1.1
 * @param {string} filePath markdown 文件路径
 * @returns {MUCLI.Markdown.Frontmatter|false} frontmatter
 */
export function tryGetFrontmatter(
  filePath?: string,
): MUCLI.Markdown.Frontmatter | false {
  let fullPath: string;
  if (filePath === undefined) {
    fullPath = "README.md";
  } else if (filePath.includes(".")) {
    const fileSuffix = filePath.split(".").pop();
    if (fileSuffix !== "md") {
      return false;
    }
    fullPath = filePath;
  } else {
    fullPath = `${filePath}.md`;
  }
  if (!fs.existsSync(fullPath)) return false;
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const contentArr = fileContent.split("\n");
  const frontmatter: MUCLI.Markdown.Frontmatter = {
    author: "",
    description: "",
    date: "",
    update: "",
    create: "",
    modify: "",
  };
  contentArr.forEach((item, index) => {
    if (index === 1) {
      frontmatter.author = item.split("Author: ")[1].trim();
    }
    if (index === 2) {
      frontmatter.description = item.split("Description: ")[1].trim();
    }
    if (index === 3) {
      frontmatter.date = item.split("Date: ")[1].trim();
    }
    if (index === 4) {
      frontmatter.update = item.split("Update: ")[1].trim();
    }
    if (index === 7) {
      frontmatter.create = item.split("`")[3];
    }
    if (index === 9) {
      frontmatter.modify = item.split("`")[1];
    }
  });
  for (const key in frontmatter) {
    const value = frontmatter[<keyof MUCLI.Markdown.Frontmatter>key];
    if (value === "" || value === undefined) {
      return false;
    }
  }
  return frontmatter;
}

/**
 * @description 根据 filename 获取对应的 label
 * @since 1.0.0
 * @param {string} filename markdown 文件名
 * @returns {MUCLI.Config.MmdLabel} label
 */
export function getLabelByFilename(filename: string): MUCLI.Config.MmdLabel {
  const configMmd = getConfig().mmd;
  const defaultLabel = configMmd.defaultLabel;
  let labelFind = configMmd.labels.find((item) => item.filename === filename);
  if (labelFind === undefined) {
    labelFind = defaultLabel;
  }
  return labelFind;
}
