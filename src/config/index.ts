/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 配置相关
 * @version 0.7.3
 */

/* Node */
import { Command } from "commander";
import inquirer from "inquirer";
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
		console.log(`正在从 ${this.backupPath} 加载备份文件...`);
		const backupData: Config = this.readConfig(this.backupPath);
		this.saveConfig(backupData, this.configPath);
		console.log("备份文件加载成功！\n请重新运行命令。");
	}

	/**
	 * @description 获取命令可用性列表
	 * @return {Array<{name: string, enable: boolean}>} 命令可用性列表
	 */
	getCommandList(): Array<{ name: string; enable: boolean }> {
		const commandList: Array<{ name: string; enable: boolean }> = [];
		COMMAND_LIST.map((command: Command) => {
			const commandInfo: { name: string; enable: boolean } = {
				name: command.name(),
				enable: this.commandUse(command),
			};
			commandList.push(commandInfo);
		});
		return commandList;
	}

	/**
	 * @description 修改配置
	 * @return {void}
	 */
	transConfig(): void {
		const commandList: Array<{ name: string; enable: boolean }> =
			this.getCommandList();
		inquirer
			.prompt([
				{
					type: "checkbox",
					name: "commands",
					message: "请选择要启用的命令",
					choices: [
						...commandList.map(
							(command: { name: string; enable: boolean }) => {
								return {
									name: command.name,
									value: command.name,
									checked: command.enable,
								};
							}
						),
					],
				},
			])
			.then(async answer => {
				let configData: Config = JSON.parse(
					JSON.stringify(this.readConfig())
				);
				commandList.map(
					(command: { name: string; enable: boolean }) => {
						configData = this.changeConfig(
							configData,
							[command.name, "enable"],
							answer.commands.includes(command.name)
						);
					}
				);
				await this.saveConfig(configData);
			});
	}
}

export default ConfigMuc;
