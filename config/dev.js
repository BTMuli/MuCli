/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 dev 相关配置
 */

/* MuCli */
import { ROOT_PATH } from '../config.js';

class DevModel {
	constructor(name, command, desc) {
		this.author = 'BTMuli<bt-muli@outlook.com>';
		this.name = name;
		this.command = command;
		this.description = desc;
	}

	/**
	 * 字符串替换
	 * @param name
	 * @return {string}
	 */
	transCommand(name) {
		return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
	}

	/**
	 * 文件路径获取
	 * @return {{cliPath: string, utilsPath: string, configPath: string}}
	 */
	getFilesPath() {
		let fileName = this.name + '.js';
		let cliPath = ROOT_PATH + '\\cli\\' + fileName;
		let configPath = ROOT_PATH + '\\config\\' + fileName;
		let utilsPath = ROOT_PATH + '\\utils\\' + fileName;
		return { cliPath, configPath, utilsPath };
	}

	/**
	 * 获取文件头部注释
	 * @return {string}
	 */
	getFileHeader() {
		/* eslint-disable */
		return (
			'/**\n' +
			'  * @author: ' + this.author + '\n' +
			'  * @date: ' + new Date().toLocaleDateString() + '\n' +
			'  * @description: ' + this.description + '\n' +
			'  * @update: ' + new Date().toLocaleDateString() + '\n' +
			'  */\n\n'
			);
		/* eslint-disable */
	}
	/**
	 * 文件内容获取
	 * @param key
	 * @return {boolean|string}
	 */
	getModel(key) {
		switch (key) {
			case 'cliPath':
				return this.getCliModel();
			case 'configPath':
				return this.getConfigModel();
			case 'utilsPath':
				return this.getUtilsModel();
			default:
				return false;
		}
	}
	/**
	 * Cli 目录下的文件内容
	 * @return {string}
	 */
	getCliModel() {
		const fileName = this.name + '.js';
		const clsName = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'/* Node */\n' +
            'import { Command } from "commander";\n' +
			'/* MuCli */\n' +
            'import ' + clsName + ' from "../utils/' + fileName + '";\n' +
			'import { PROJECT_INFO } from \'../config.js\';\n\n' +
            'const ' + this.name + '= new Command();\n\n' +
			'/* 版本管理 */\n' +
			'const '+ clsName + 'Version = PROJECT_INFO[\'subversion\'][\'' + this.name + '\'];\n\n' +
            '/* 基本信息 */\n' +
            this.name + '\n' +
            '    .name(\'' + this.command + '\')\n' +
            '    .description(\'' + this.description + '\')\n' +
            '    .version(' + clsName + 'Version, \'-sv, --subversion\', \'output the subversion of MuCli-' + clsName + '\');\n\n' +
            'export default ' + this.name + ';\n'
		);
		/* eslint-disable */
	}
	/**
	 * Config 目录下的文件内容
	 * @return {string}
	 */
	getConfigModel() {
		let clsName = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
            'class ' + clsName + 'Model {\n\n}\n\n' +
            'export default ' + clsName + 'Model;\n'
		);
		/* eslint-disable */
	}
	/**
	 * Utils 目录下的文件内容
	 * @return {string}
	 */
	getUtilsModel() {
		let fileName = this.name + '.js';
		let clsName = this.transCommand(this.name);
		/* eslint-disable */
		return (
			this.getFileHeader() +
			'/* Node */\n' +
            'import inquirer from "inquirer";\n' +
			'/* MuCli */\n' +
            'import ' + clsName + 'Model from "../config/' + fileName + '";\n' +
            'import MucFile from "./file.js";\n\n' +
            'class ' + clsName + ' {\n\n}\n\n' +
            'export default ' + clsName + ';\n'
		);
		/* eslint-disable */
	}
}

export default DevModel;
