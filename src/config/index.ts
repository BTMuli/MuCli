/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 配置相关
 * @version 0.7.0
 */

/* MuCli */
import MucYaml from "../utils/yaml";
import { ROOT_PATH } from "config";
import { MucConfig } from "utils/interface";
/* SubCommand */
import dev from "../cli/dev";
import markdown from "../cli/markdown";
import pip from "../cli/pip";
import { Command } from "commander";
/* 项目命令列表 */
export const COMMAND_LIST = [dev, markdown, pip];

class Config {
	configPath: string;
	mucYaml: MucYaml;

	constructor(path: string = undefined) {
		if (path === undefined) {
			path = "\\config_default\\config.yml";
		}
		this.configPath = ROOT_PATH + path;
		this.mucYaml = new MucYaml(path);
	}

	/**
	 * @description 读取配置文件
	 * @return {MucConfig} 配置文件
	 */
	readConfig(): MucConfig {
		return this.mucYaml.readYaml();
	}

	/**
	 * @description 读取子配置
	 * @param args {string[]|string} 配置路径
	 * @return {any} 配置内容
	 */
	readConfigDetail(args: string[] | string): any {
		let configRead: MucConfig = this.readConfig();
		typeof args !== "string"
			? args?.map((arg: string) => {
					configRead = configRead[arg];
			  })
			: (configRead = configRead[args]);
		return configRead;
	}

	/**
	 * @description 加载校验
	 * @param command {Command} commander 实例
	 * @return {boolean} 是否加载
	 */
	commandUse(command: Command): boolean {
		const cmdConfig: object = this.readConfigDetail(command.name());
		return cmdConfig["enable"];
	}

	/**
	 * @description 读取并加载模块
	 * @param {Command} program commander 实例
	 * @return {void}
	 */
	loadConfig(program: Command): void {
		COMMAND_LIST.map((command: any) => {
			if (this.commandUse(command)) {
				program.addCommand(command);
			}
		});
	}

	/**
	 * @description 修改配置文件
	 * @param name {string[]|string} 配置路径
	 * @param target {string} 配置目标
	 * @param value {string|boolean} 配置值
	 * @return {void}
	 */
	changeConfig(name: string[] | string, target: string, value: any): void {
		const commandPath: string = this.mucYaml.configPath;
		this.mucYaml.changeYaml(commandPath, name, target, value);
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
			if (name === "all") {
				commandList.map((command: string) => {
					this.changeConfig(command, "enable", target === "on");
				});
			} else {
				this.changeConfig(name, "enable", target === "on");
			}
		} else {
			console.log("参数错误");
		}
	}
}

export default Config;
