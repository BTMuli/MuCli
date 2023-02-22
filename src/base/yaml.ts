/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description yaml 文件解析及相关操作
 * @version 0.7.2
 */

/* Node */
import yamljs from "yamljs";
/* MuCli Base */
import FileBase from "./file";
import { ROOT_PATH } from "../index";
/* MuCli Interface */
import { Config } from "../interface/muc";

class YamlBase {
	yamlPath: string;
	defaultPath: string;
	fileTool: FileBase;

	constructor(path: string = undefined) {
		this.fileTool = new FileBase();
		this.defaultPath = "\\config_default\\config.yml";
		if (path === undefined) {
			path = this.defaultPath;
		}
		this.yamlPath = ROOT_PATH + path;
	}

	/**
	 * @description 读取 yaml 文件
	 * @param yamlPath {string} 文件路径
	 * @return {Config} 文件内容
	 */
	readYaml(yamlPath: string = undefined): Config {
		if (yamlPath === undefined) {
			yamlPath = this.yamlPath;
		}
		return yamljs.load(yamlPath);
	}

	/**
	 * @description 读取具体配置
	 * @param yamlData {Config} yaml 文件内容
	 * @param args {string[]} 配置路径
	 * @return {object|string|boolean} 配置内容
	 */
	readYamlDetail(
		yamlData: Config,
		args: string[]
	): object | string | boolean {
		let yamlRead: object = yamlData;
		args.map((arg: string) => {
			yamlRead = yamlRead[arg];
		});
		return yamlRead;
	}

	/**
	 * @description 修改 yaml 文件某属性值
	 * @param yamlData {Config} yaml 文件内容
	 * @param args {string[]} 属性路径
	 * @param value {object|string|boolean} 属性值
	 * @return {Config} 修改后的 yaml 文件内容
	 */
	changeYaml(
		yamlData: Config,
		args: string[],
		value: object | string | boolean
	): Config {
		let yamlRead: object = yamlData;
		args.map((arg: string, index: number) => {
			if (index === args.length - 1) {
				yamlRead[arg] = value;
			} else {
				yamlRead = yamlRead[arg];
			}
		});
		return yamlData;
	}

	/**
	 * @description 保存 yaml 文件
	 * @param yamlData {Config} yaml 文件内容
	 * @param yamlPath {string} 文件路径
	 * @return {void}
	 */
	saveYaml(yamlData: Config, yamlPath: string = undefined): void {
		if (yamlPath === undefined) {
			yamlPath = this.yamlPath;
		}
		this.fileTool.updateFile(yamlPath, yamljs.stringify(yamlData, 4));
	}
}

export default YamlBase;
