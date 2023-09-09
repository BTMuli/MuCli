/**
 * @file src/utils/getBaseInfo.ts
 * @description 获取项目基本信息
 * @since 1.0.0
 */

import appRootPath from "app-root-path";
import fs from "fs-extra";

/**
 * @description 获取项目根路径
 * @function getRootPath
 * @since 1.0.0
 * @returns {string} 项目根路径
 */
export function getRootPath(): string {
  return appRootPath.path;
}

/**
 * @description 读取 package.json 文件
 * @function readPackage
 * @since 1.0.0
 * @returns {MUCLI.Package.FullInfo} package.json 文件信息
 */
export function readPackage(): MUCLI.Package.FullInfo {
  const jsonPath = appRootPath.resolve("package.json");
  return fs.readJSONSync(jsonPath);
}
