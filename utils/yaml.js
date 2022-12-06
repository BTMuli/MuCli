/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: yaml 文件解析及相关操作
 * @update: 2021-12-06
 */

/* Node */
import YAML from 'yamljs';
/* MuCli */
import MucFile from './file.js';
import { ROOT_PATH } from '../config.js';

class MucYaml {
	constructor(path = undefined) {
		if (path === undefined) {
			this.configPath = ROOT_PATH + '\\config_default\\config.yml';
		} else {
			this.configPath = ROOT_PATH + path;
		}
		this.mucFile = new MucFile();
	}
	/**
	 * 读取 yaml 文件
	 * @param filePath 文件路径
	 * @return {Object} yaml 文件内容
	 */
	readYaml(filePath = undefined) {
		if (filePath === undefined) {
			filePath = this.configPath;
		}
		return YAML.load(filePath);
	}
	/**
	 * 读取具体配置
	 * @param yamlData yaml 文件内容
	 * @param args 配置位置
	 * @return {*} 配置内容
	 */
	readYamlDetail(yamlData, args) {
		let yamlRead = yamlData;
		args.forEach(value => {
			yamlRead = yamlRead[value];
		});
		return yamlRead;
	}
	/**
	 * 修改 yaml 文件某属性值
	 * @param filePath yaml 文件路径
	 * @param args 要修改属性位置，数组形式
	 * @param itemKey  要修改属性名称
	 * @param itemVal  要修改属性值
	 */
	changeYaml(filePath = undefined, args, itemKey, itemVal) {
		if (filePath === undefined) {
			filePath = this.configPath;
		}
		let yamlTrans = this.readYaml(filePath);
		// 修改属性值
		let yamlRead = yamlTrans;
		args.forEach((value, index) => {
			if (index === args.length - 1) {
				yamlRead[value][itemKey] = itemVal;
			} else {
				yamlRead = yamlRead[value];
			}
		});
		this.mucFile.writeFile(filePath, YAML.stringify(yamlTrans, 4));
	}
}

export default MucYaml;
