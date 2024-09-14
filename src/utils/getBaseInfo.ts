/**
 * @file src/utils/getBaseInfo.ts
 * @description 获取项目基本信息
 * @since 1.3.1
 */

import { resolve } from "path";

import appRootPath from "app-root-path";
import fs from "fs-extra";
import YAML from "yamljs";

/**
 * @description 子命令枚举
 * @enum SubCommand
 * @since 1.2.0
 * @property {string} dev - dev 命令
 * @property {string} mmd - mmd 命令
 * @property {string} pip - pip 命令
 * @property {string} rs - rs 命令
 * @return enum
 */
export enum SubCommand {
  dev = "dev",
  mmd = "mmd",
  pip = "pip",
  rs = "rs",
}

/**
 * @description 获取项目根路径
 * @function getRootPath
 * @since 1.3.1
 * @returns {string} 项目根路径
 */
export function getRootPath(): string {
  if (appRootPath.path.endsWith("dist")) {
    return appRootPath.resolve("../");
  }
  // 查找是否有 node_modules/@btmuli/mucli 目录
  const searchPath = resolve(
    appRootPath.path,
    "node_modules",
    "@btmuli",
    "mucli",
  );
  if (fs.existsSync(searchPath)) return searchPath;
  return appRootPath.path;
}

/**
 * @description 读取 package.json 文件
 * @function readPackage
 * @since 1.1.0
 * @returns {MUCLI.Package.FullInfo} package.json 文件信息
 */
export function readPackage(): MUCLI.Package.FullInfo {
  const jsonPath = resolve(getRootPath(), "package.json");
  return fs.readJSONSync(jsonPath);
}

/**
 * @description 获取子命令版本号
 * @function getSubVersion
 * @since 1.0.0
 * @param {SubCommand} subCommand - 子命令
 * @returns {string} 子命令版本号
 */
export function getSubVersion(subCommand: SubCommand): string {
  const packageInfo = readPackage();
  return packageInfo.subVersion[subCommand];
}

/**
 * @description 获取脚本
 * @function getScripts
 * @since 1.0.0
 * @returns {string[]} 脚本列表
 */
export function getScripts(): string[] {
  const packageInfo = readPackage();
  return Object.keys(packageInfo.scripts);
}

/**
 * @description 获取配置文件所在路径
 * @function getConfigPath
 * @since 1.1.0
 * @param {boolean} isDefault - 是否为默认配置文件
 * @returns {string} 配置文件所在路径
 */
export function getConfigPath(isDefault: boolean = false): string {
  const configDir = resolve(getRootPath(), "config");
  const defaultPath = resolve(configDir, "default.yml");
  if (isDefault) return defaultPath;
  const dateDefault = YAML.load(defaultPath).update;
  const configPath = resolve(configDir, "user.yml");
  if (!fs.existsSync(configPath)) {
    fs.copyFileSync(defaultPath, configPath);
  }
  const dateUser = YAML.load(configPath).update;
  if (dateUser < dateDefault) {
    fs.copyFileSync(defaultPath, configPath);
  }
  return configPath;
}

/**
 * @description 获取版本
 * @function getVersion
 * @since 1.3.0
 * @returns {string} 版本号
 */
export function getVersion(): string {
  return readPackage().version;
}
