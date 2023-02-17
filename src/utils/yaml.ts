/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description yaml 文件解析及相关操作
 * @version 0.7.1
 */

/* Node */
import yamljs from "yamljs";
/* MuCli */
import MucFile from "./file";
import { ROOT_PATH } from "../config";

class MucYaml {
	configPath: string;
	mucFile: MucFile;

	constructor(path: string = undefined) {
		if (path === undefined) {
			this.configPath = ROOT_PATH + "\\config_default\\config.yml";
		} else {
			this.configPath = ROOT_PATH + path;
		}
		this.mucFile = new MucFile();
	}

	/**
	 * @description 读取 yaml 文件
	 * @param filePath {string} 文件路径
	 * @return {any} 文件内容
	 */
	readYaml(filePath: string = undefined): any {
		if (filePath === undefined) {
			filePath = this.configPath;
		}
		return yamljs.load(filePath);
	}

	/**
	 * @description 读取具体配置
	 * @param yamlData {object} yaml 文件内容
	 * @param args { string[] } 配置路径
	 * @return {object} 配置内容
	 */
	readYamlDetail(yamlData: object, args: string[]): object {
		let yamlRead = yamlData;
		args.map((arg: string) => {
			yamlRead = yamlRead[arg];
		});
		return yamlRead;
	}

	/**
	 * @description 修改 yaml 文件某属性值
	 * @param filePath {string} yaml 文件路径
	 * @param args {string[]|string} 属性路径
	 * @param itemKey {string} 属性名
	 * @param itemValue {string|boolean} 属性值
	 * @return {void}
	 */
	changeYaml(
		filePath: string = undefined,
		args: string[] | string,
		itemKey: string,
		itemValue: string | boolean
	): void {
		if (filePath === undefined) {
			filePath = this.configPath;
		}
		const yamlData = this.readYaml(filePath);
		let yamlRead = yamlData;
		if (typeof args !== "string") {
			yamlRead = this.readYamlDetail(yamlData, args);
			yamlRead[itemKey] = itemValue;
		} else {
			yamlRead[args][itemKey] = itemValue;
		}
		this.mucFile.coverFile(filePath, yamljs.stringify(yamlData, 4));
	}
}

export default MucYaml;
