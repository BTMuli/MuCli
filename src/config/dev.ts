/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 dev 相关配置
 * @version 0.2.0
 */

/* MuCli */
import { ROOT_PATH } from "../config";
import { DevFilesPath } from "../utils/interface";

class DevModel {
	author: string;
	name: string;
	command: string;
	description: string;

	constructor(name: string, command: string, description: string) {
		this.author = "BTMuli<bt-muli@outlook.com>";
		this.name = name;
		this.command = command;
		this.description = description;
	}

	/**
	 * @description 字符串替换
	 * @param name {string} command 名称
	 * @example "dev" -> "Dev"
	 * @return {string} 替换后的字符串
	 */
	transCommand(name: string): string {
		return name[0].toUpperCase() + name.slice(1).toLowerCase();
	}

	/**
	 * @description 文件路径获取
	 * @todo ts版本需测试
	 * @return {DevFilesPath} 文件路径相关接口
	 */
	getFilesPath(): DevFilesPath {
		const fileName: string = this.command + ".ts";
		return {
			cliPath: `${ROOT_PATH}\\src\\cli\\${fileName}`,
			utilsPath: `${ROOT_PATH}\\src\\utils\\${fileName}`,
			configPath: `${ROOT_PATH}\\src\\config\\${fileName}`,
		};
	}

	/**
	 * @description 获取文件头部注释
	 * @return {string} 文件头部注释
	 */
	getFileHeader(): string {
		/* eslint-disable */
		return (
			'/**\n' +
			` * @author ${this.author}\n` +
			` * @description ${this.description}\n` +
			` * @version 0.0.1\n` +
			' */\n\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Cli 目录下的文件内容
	 * @todo 需测试
	 * @return {string} 文件内容
	 */
	getCliModel(): string {
		const fileName: string = this.command + ".ts";
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'/* Node */\n' +
			'import { Command } from "commander";\n' +
			'/* MuCli */\n' +
			`import { PROJECT_INFO } from "../config";\n` +
			'import ' + clsName + ' from "../utils/' + fileName + '";\n\n' +
			'const ' + this.name + ':' + clsName + ' = new ' + clsName + '();\n\n' +
			'/* 版本管理 */\n' +
			'const '+ clsName + 'Version:string = PROJECT_INFO["subversion"]["' + this.command + '";\n\n' +
			'/* 基本信息 */\n' +
			this.name + '.name("' + this.command + '")\n' +
			'\t.description("' + this.description + '")\n' +
			'\t.version(' + clsName + 'Version)\n' +
			'\t\t"-sv, --subversion",\n' +
			'\t\t"output the subversion of MuCli-' + clsName + '"\n' +
			'\t);\n\n' +
			'export default ' + this.name + ';\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Utils 目录下的文件内容
	 * @todo 需测试
	 * @return {string} 文件内容
	 */
	getUtilsModel(): string {
		const fileName: string = this.command + ".ts";
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'/* Node */\n' +
			'import { prompt } from "inquirer";\n' +
			'/* MuCli */\n' +
			'import MucFile from "./file";\n' +
			'import ' + clsName + 'Model from "../config/' + fileName + '";\n\n' +
			'class ' + clsName + ' {}\n\n' +
			'export default ' + clsName + ';\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Config 目录下的文件内容
	 * @todo 需测试
	 * @return {string} 文件内容
	 */
	getConfigModel(): string {
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'class ' + clsName + 'Model{}\n\n' +
			'export default ' + clsName + 'Model;\n'
		);
		/* eslint-enable */
	}
}

export default DevModel;
