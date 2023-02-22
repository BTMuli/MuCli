/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description Config 基类
 * @version 0.7.2
 */

/* MuCli */
import YamlBase from "./yaml";
import { ROOT_PATH } from "../index";
import { Config } from "../interface/muc";

class ConfigBase {
	configPath: string;
	defaultPath: string;
	yamlTool: YamlBase;

	constructor(path: string = undefined) {
		this.yamlTool = new YamlBase(path);
		this.defaultPath = this.yamlTool.defaultPath;
		if (path === undefined) {
			path = this.defaultPath;
		}
		this.configPath = ROOT_PATH + path;
	}

	/**
	 * @description 读取配置文件
	 * @return {Config} 配置文件
	 */
	readConfig(): Config {
		return this.yamlTool.readYaml();
	}

	/**
	 * @description 读取具体配置
	 * @param configData {Config} 配置文件内容
	 * @param args {string[]} 配置路径
	 * @return {object|string|boolean} 配置内容
	 */
	readConfigDetail(
		configData: Config,
		args: string[]
	): object | string | boolean {
		return this.yamlTool.readYamlDetail(configData, args);
	}

	/**
	 * @description 修改配置文件
	 * @param configData {Config} 配置内容
	 * @param args {string[]} 配置路径
	 * @param value {object|string|boolean} 配置内容
	 * @return {Config} 修改后的配置内容
	 */
	changeConfig(
		configData: Config,
		args: string[],
		value: object | string | boolean
	): Config {
		return this.yamlTool.changeYaml(configData, args, value);
	}

	/**
	 * @description 保存配置文件
	 * @param configData {Config} 配置内容
	 * @return {void}
	 */
	saveConfig(configData: Config): void {
		this.yamlTool.saveYaml(configData);
	}
}

export default ConfigBase;
