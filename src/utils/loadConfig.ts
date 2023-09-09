/**
 * @file src/utils/loadConfig.ts
 * @description 加载配置文件
 * @since 1.0.0
 */

import { type Command } from "commander";
import fs from "fs-extra";
import YAML from "yamljs";

import { getConfigPath } from "./getBaseInfo";

/**
 * @description 获取配置文件信息
 * @function getConfig
 * @since 1.0.0
 * @param {boolean} useLocal - 是否使用本地配置文件
 * @returns {MUCLI.Config.FullInfo} 配置文件信息
 */
export function getConfig(useLocal: boolean = false): MUCLI.Config.FullInfo {
  const configPath = getConfigPath(useLocal);
  return YAML.load(configPath);
}

/**
 * @description 获取开启的子命令
 * @function getOnSubCommands
 * @since 1.0.0
 * @returns {string[]} 开启的子命令
 */
export function getOnSubCommands(): string[] {
  const config: MUCLI.Config.FullInfo = getConfig();
  const onSubCommands: string[] = [];
  if (config.dev.enable) onSubCommands.push("dev");
  if (config.mmd.enable) onSubCommands.push("mmd");
  return onSubCommands;
}

/**
 * @description 挂载子命令
 * @function mountSubCommand
 * @since 1.0.0
 * @param {Command} program - 主命令
 * @param {Command[]} subCommands - 子命令
 * @returns {void}
 */
export function mountSubCommand(
  program: Command,
  subCommands: Command[],
): void {
  const onSubCommands = getOnSubCommands();
  for (const subCommand of subCommands) {
    if (onSubCommands.includes(subCommand.name())) {
      program.addCommand(subCommand);
    }
  }
}

/**
 * @description 修改子命令启用状态
 * @function changeSubCommandEnable
 * @since 1.0.0
 * @param {string[]} subCommands - 启用的子命令
 * @returns {void}
 */
export function changeSubCommandEnable(subCommands: string[]): void {
  const config: MUCLI.Config.FullInfo = getConfig();
  config.dev.enable = subCommands.includes("dev");
  config.mmd.enable = subCommands.includes("mmd");
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, YAML.stringify(config, 4, 2));
}
