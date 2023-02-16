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
			'/**\r\n' +
			` * @author ${this.author}\r\n` +
			` * @description ${this.description}\r\n` +
			` * @version 0.0.1\r\n` +
			' */\r\n\r\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Cli 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getCliModel(): string {
		const fileName: string = this.command;
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'/* Node */\r\n' +
			'import { Command } from "commander";\r\n' +
			'/* MuCli */\r\n' +
			`import { PROJECT_INFO } from "../config";\r\n` +
			'// import ' + clsName + ' from "../utils/' + fileName + '";\r\n\r\n' +
			'/* 版本管理 */\r\n' +
			'const '+ clsName + 'Version: string = PROJECT_INFO["subversion"]["' + this.command + '"];\r\n\r\n' +
			'const ' + this.name + ': Command = new Command();\r\n\r\n' +
			'/* 基本信息 */\r\n' +
			this.name + '.name("' + this.command + '")\r\n' +
			'\t.description("' + this.description + '")\r\n' +
			'\t.version(\r\n' +
			'\t\t' + clsName + 'Version,\r\n' +
			'\t\t"-sv, --subversion",\r\n' +
			'\t\t"output the subversion of MuCli-' + clsName + '"\r\n' +
			'\t);\r\n\r\n' +
			'export default ' + this.name + ';\r\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Utils 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getUtilsModel(): string {
		const fileName: string = this.command + ".ts";
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'/* Node */\r\n' +
			'// import inquirer from "inquirer";\r\n' +
			'/* MuCli */\r\n' +
			'// import MucFile from "./file";\r\n' +
			'// import ' + clsName + 'Model from "../config/' + fileName + '";\r\n\r\n' +
			'class ' + clsName + ' {}\r\n\r\n' +
			'export default ' + clsName + ';\r\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Config 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getConfigModel(): string {
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'class ' + clsName + 'Model {}\r\n\r\n' +
			'export default ' + clsName + 'Model;\r\n'
		);
		/* eslint-enable */
	}
}

export default DevModel;
