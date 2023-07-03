/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 dev 相关配置
 * @since 0.2.3
 */

/* MuCli */
import { ROOT_PATH } from "../index";
import { FilesPath } from "../interface/dev";

class ModelDev {
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
	 * @return {FilesPath} 文件路径相关接口
	 */
	getFilesPath(): FilesPath {
		const fileName: string = this.command + ".ts";
		return {
			cliPath: `${ROOT_PATH}\\src\\cli\\${fileName}`,
			configPath: `${ROOT_PATH}\\src\\config\\${fileName}`,
			interPath: `${ROOT_PATH}\\src\\interface\\${fileName}`,
			modelPath: `${ROOT_PATH}\\src\\model\\${fileName}`,
			utilsPath: `${ROOT_PATH}\\src\\utils\\${fileName}`,
		};
	}

	/**
	 * @description 获取文件头部注释
	 * @since 0.2.3
	 * @return {string} 文件头部注释
	 */
	getFileHeader(): string {
		/* eslint-disable */
    return (
      '/**\r\n' +
      ` * @author ${this.author}\r\n` +
      ` * @description ${this.description}\r\n` +
      ` * @since 0.0.1\r\n` +
      ' */\r\n\r\n'
    );
    /* eslint-enable */
	}

	/**
	 * @description Cli 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getCliContent(): string {
		const fileName: string = this.command;
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
    return (
      this.getFileHeader() +
      '/* Node */\r\n' +
      'import { Command } from "commander";\r\n' +
      '/* MuCli */\r\n' +
			'// import ' + clsName + ' from "../utils/' + fileName + '";\r\n' +
      `import { PROJECT_INFO } from "../index";\r\n\r\n` +
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
	 * @description Config 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getConfigContent(): string {
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
    return (
      this.getFileHeader() +
      '/* MuCli Base */\r\n' +
			'import ConfigBase from "../base/config";\r\n' +
			'/* MuCli Interface */\r\n' +
			`// import { Config } from "../interface/${this.command}";\r\n` +
			'// import { Config as ConfigMuc } from "../interface/muc";\r\n\r\n' +
			`class Config${clsName} extends ConfigBase {\r\n}\r\n\r\n` +
			`export default Config${clsName};\r\n`
    );
    /* eslint-enable */
	}

	/**
	 * @description Interface 目录下的文件内容
	 * @since 0.2.3
	 * @return {string} 文件内容
	 */
	getInterContent(): string {
		/* eslint-disable */
		return (
			'/**\r\n' +
			` * @author ${this.author}\r\n` +
			` * @description ${this.command} 涉及到的 interface\r\n` +
			' * @since 0.0.1\r\n' +
			' */\r\n\r\n' +
			'import { Config as ConfigBase } from "./index";\r\n\r\n' +
			'/**\r\n' +
			' * @description 配置文件对应的 interface\r\n' +
			' * @since 0.0.1\r\n' +
			' * @interface Config\r\n' +
			' * @property {string} name command 名称\r\n' +
			' * @property {boolean} enable 是否启用\r\n' +
			' * @return {Config} 配置文件对应的 interface\r\n' +
			' */\r\n' +
			'export interface Config extends ConfigBase {\r\n' +
			'\tname: string;\r\n' +
			'\tenable: boolean;\r\n' +
			'}\r\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Model 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getModelContent(): string {
		const clsName: string = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'class ' + clsName + 'Model {}\r\n\r\n' +
			'export default ' + clsName + 'Model;\r\n'
		);
		/* eslint-enable */
	}

	/**
	 * @description Utils 目录下的文件内容
	 * @return {string} 文件内容
	 */
	getUtilsContent(): string {
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
}

export default ModelDev;
