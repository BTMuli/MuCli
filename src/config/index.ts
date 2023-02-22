/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 配置相关
 * @version 0.7.2
 */

/* Node */
import { Command } from "commander";
/* MuCli Base */
import ConfigBase from "../base/config";
/* MuCli Interface */
import { Config } from "../interface/muc";
/* SubCommand */
import dev from "../cli/dev";
import markdown from "../cli/mmd";
import pip from "../cli/pip";
import typora from "../cli/typora";

/* 项目命令列表 */
export const COMMAND_LIST = [dev, markdown, pip, typora];

class ConfigMuc extends ConfigBase {
	/**
	 * @description 加载校验
	 * @param command {Command} commander 实例
	 * @return {boolean} 是否加载
	 */
	commandUse(command: Command): boolean {
		const commandEnable: object | string | boolean = this.readConfigDetail(
			this.readConfig(),
			[command.name(), "enable"]
		);
		return commandEnable === true;
	}

	/**
	 * @description 读取并加载模块
	 * @param {Command} program commander 实例
	 * @return {void}
	 */
	loadConfig(program: Command): void {
		COMMAND_LIST.map((command: Command) => {
			if (this.commandUse(command)) {
				program.addCommand(command);
			}
		});
	}

	/**
	 * @description 当 config 文件不存在时，加载备份文件
	 * @return {void}
	 */
	loadBackupConfig(): void {
		console.log("配置文件不存在，加载备份文件...");
		const backupData: Config = this.readConfig(this.backupPath);
		this.saveConfig(backupData, this.configPath);
		console.log("备份文件加载成功！\n请重新运行命令。");
	}

	/**
	 * @description 修改命令可用性
	 * @param name {string} 命令名称
	 * @param target {string} 配置目标
	 * @return {void}
	 */
	transConfig(name: string, target: string): void {
		const commandList: string[] = COMMAND_LIST.map(command => {
			return command.name();
		});
		const targetList: string[] = ["on", "off"];
		if (
			targetList.includes(target) &&
			(commandList.includes(name) || name === "all")
		) {
			let configData: Config = JSON.parse(
				JSON.stringify(this.readConfig())
			);
			if (name === "all") {
				commandList.map((command: string) => {
					configData = this.changeConfig(
						configData,
						[command, "enable"],
						target === "on"
					);
				});
			} else {
				configData = this.changeConfig(
					configData,
					[name, "enable"],
					target === "on"
				);
			}
			this.saveConfig(configData);
		} else {
			console.log("参数错误");
		}
	}
}

export default ConfigMuc;
