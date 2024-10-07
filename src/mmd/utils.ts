/**
 * @file src/mmd/utils.ts
 * @description mmd 命令-工具函数
 * @since 1.4.1
 * @version 1.2.0
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
 * @since 1.4.0
 * @param {string} filepath markdown 文件路径
 * @returns {string} markdown 文件路径
 */
export function handleMarkdownPath(filepath?: string): string {
  let fullPath = "./README.md";
  if (filepath !== undefined) {
    if (filepath.endsWith(".md")) {
      fullPath = filepath;
    } else {
      fullPath = `${filepath}.md`;
    }
  }
  return fullPath;
}

/**
 * @description 处理 markdown 文件名
 * @since 1.2.1
 * @version 1.1.0
 * @param {string} filepath markdown 文件路径
 * @returns {string} markdown 文件名
 */
export function handleMarkdownName(filepath: string): string {
  let filename: string | undefined;
  if (filepath.includes("\\")) {
    filename = filepath.split("\\").pop();
  } else if (filepath.includes("/")) {
    filename = filepath.split("/").pop();
  } else {
    filename = filepath;
  }
  if (filename === undefined) {
    filename = "README";
  }
  if (filename.endsWith(".md")) {
    filename = filename.split(".md")[0];
  }
  return filename;
}

/**
 * @description 获取 markdown 文件的 frontmatter
 * @since 1.2.1
 * @version 1.1.0
 * @param {string} author markdown 文件作者
 * @param {string} description markdown 文件描述
 * @param {MUCLI.Markdown.CreateOptions} options markdown 文件创建时间
 * @returns {[string,number]} frontmatter内容及行数
 */
export function getFrontmatter(
  author: string,
  description: string,
  options?: MUCLI.Markdown.CreateOptions,
): [string, number] {
  let extra = 0;
  const templatePath = resolve(getRootPath(), "template", "MuCli", "README.md");
  const template = fs.readFileSync(templatePath, "utf-8");
  const date = getDate(false);
  const dateFull = getDate(true);
  const templateArr = template.split("\n");
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
      res = item.replace("modify", dateFull);
      templateArr[index] = res;
    }
    if (index === 7) {
      if (options?.create !== undefined)
        res = item.replace("create", options.create);
      else res = item.replace("create", dateFull);
      templateArr[index] = res;
    }
    if (index === 3) {
      if (options?.create !== undefined) {
        const dateCreate = options.create.split(" ")[0];
        res = item.replace("date", dateCreate);
      } else res = item.replace("date", date);
      templateArr[index] = res;
    }
  });
  if (options?.raw !== undefined) {
    const keyExclude = ["author", "description", "date", "update"];
    let insertIndex = 5;
    for (const key in options.raw) {
      if (keyExclude.includes(key.toLowerCase())) continue;
      templateArr.splice(insertIndex, 0, `${key}: ${options.raw[key]}`);
      extra += 1;
      insertIndex += 1;
    }
  }
  return [templateArr.join("\n"), extra];
}

/**
 * @description 尝试读取 markdown 文件的 frontmatter
 * @since 1.4.1
 * @version 1.2.0
 * @param {string} filePath markdown 文件路径
 * @returns {MUCLI.Markdown.Frontmatter|false} frontmatter
 */
export function tryGetFrontmatter(
  filePath?: string,
): MUCLI.Markdown.FrontmatterFull | false {
  let fullPath: string;
  if (filePath === undefined) fullPath = "README.md";
  else if (filePath.includes(".")) {
    const fileSuffix = filePath.split(".").pop();
    if (fileSuffix !== "md") return false;
    fullPath = filePath;
  } else fullPath = `${filePath}.md`;
  if (!fs.existsSync(fullPath)) return false;
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const fmCheckRegex = /^---(\r\n|\n)(.*?)(\r\n|\n)---(\r\n|\n)/gs;
  const fmCheck = fileContent.match(fmCheckRegex);
  if (fmCheck === null) return false;
  const fmStr = fmCheck[0];
  const content = fileContent.replace(fmStr, "");
  const frontmatter: MUCLI.Markdown.Frontmatter = {
    author: "",
    description: "",
    date: "",
    update: "",
    create: "",
    modify: "",
  };
  const fmGet = parseFrontmatter(fmStr);
  if (fmGet === undefined) return false;
  for (const key in fmGet) {
    if (key === "Author" || key === "author") frontmatter.author = fmGet[key];
    if (key === "Description" || key === "description")
      frontmatter.description = fmGet[key];
    if (key === "Date" || key === "date") frontmatter.date = fmGet[key];
    if (key === "Update" || key === "update") frontmatter.update = fmGet[key];
    if (
      frontmatter.author !== "" &&
      frontmatter.description !== "" &&
      frontmatter.date !== "" &&
      frontmatter.update !== ""
    ) {
      break;
    }
  }
  const createRegex = /生成于 `(.*)`/g;
  const createMatch = content.match(createRegex);
  if (createMatch !== null) frontmatter.create = createMatch[0].split("`")[1];
  else frontmatter.create = date2str(fs.statSync(fullPath).birthtime);
  return { fm: frontmatter, raw: fmGet };
}

/**
 * @description 解析 frontmatter
 * @since 1.2.1
 * @version 1.1.0
 * @param {string} str frontmatter 字符串
 * @returns {Record<string, string>} frontmatter
 */
function parseFrontmatter(str: string): Record<string, string> {
  const frontmatter: Record<string, string> = {};
  const frontmatterArr = str.split(/(\r\n|\n)/);
  frontmatterArr.forEach((item) => {
    if (item === "---" || item === "") return;
    if (!item.includes(":")) return;
    if (item.startsWith("---")) return;
    const key = item.split(":")[0].trim();
    frontmatter[key] = item.split(":")[1].trim();
  });
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
  if (labelFind === undefined) labelFind = defaultLabel;
  return labelFind;
}

/**
 * @description 时间戳转换为字符串
 * @since 1.4.1
 * @version 1.2.0
 * @param {Date} date - 时间
 * @returns {string}
 */
export function date2str(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
