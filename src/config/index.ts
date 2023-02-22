/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 配置相关
 * @version 0.7.2
 */

/* MuCli */
import ConfigBase from "../base/config";
import { Config } from "../interface/muc";
/* SubCommand */
import dev from "../cli/dev";
import markdown from "../cli/markdown";
import pip from "../cli/pip";
import { Command } from "commander";
/* 项目命令列表 */
export const COMMAND_LIST = [dev, markdown, pip];

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
	 * @description 修改命令可用性
	 * @param name {string} 命令名称
	 * @param target {string} 配置目标
	 * @todo 需要测试修改是否成功
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
			// 输出修改后的配置文件
			console.log(configData);
		} else {
			console.log("参数错误");
		}
	}
}

export default ConfigMuc;
