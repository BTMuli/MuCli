/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: markdown 文件相关操作
 * @update: 2022-12-21
 */

/* Node */
import inquirer from 'inquirer';
import { exec } from 'child_process';
/* MuCli */
import MarkdownModel from '../config/markdown.js';
import MucFile from './file.js';
import Config from '../config/index.js';
import Typora from './typora.js';

class Markdown {
	constructor() {
		const markdownConfig = new Config().readConfigDetail('mmd');
		const typora = new Typora(markdownConfig.typora);
		this.config = new Config();
		this.label = markdownConfig.label;
		this.label_default = markdownConfig.label.default;
		this.typora = typora;
		this.mucFile = new MucFile();
	}
	/* Typora 相关 */
	/**
	 * @description 检测 Typora 配置
	 */
	testTypora() {
		this.typora.verifyConfig();
	}
	/**
	 * @description 获取 Typora 相关配置
	 */
	showTypora() {
		this.typora.showConfig();
	}
	/**
	 * @description 调用 Typora 打开文件
	 * @param fileName {string} 文件名称
	 */
	openTypora(fileName) {
		this.typora.openFile(fileName);
	}
	/**
	 * @description 修改 Typora 配置
	 */
	modifyTypora() {
		this.showTypora();
		inquirer
			.prompt([
				{
					type: 'checkbox',
					name: 'typora',
					message: '请选择要修改的配置',
					choices: [
						{
							name: 'Typora 可用性',
							value: 'enable',
						},
						{
							name: 'Typora 路径',
							value: 'path',
						},
					],
				},
				{
					type: 'input',
					name: 'enable',
					message: `确认修改可用性？（当前${
						this.typora.enable ? '可用' : '不可用'
					}）`,
					when: answers => answers.typora.includes('enable'),
					default: true,
				},
				{
					type: 'input',
					name: 'path',
					message: '请输入 Typora 路径',
					when: answers => answers.typora.includes('path'),
					default: this.typora.path,
				},
			])
			.then(answers => {
				if (answers.typora.length !== 0) {
					if (answers.typora.includes('enable')) {
						this.typora.enable = !this.typora.enable;
					}
					if (answers.typora.includes('path')) {
						this.typora.path = answers.path;
					}
					this.typora.saveConfig();
					console.log('\nTypora 配置修改成功');
				} else {
					console.log('\n未对Typora配置进行修改。');
				}
				this.showTypora();
			});
	}
	/**
	 * @description 根据配置选择响应操作
	 */
	operaTypora() {
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'typora',
					message: '请选择操作',
					choices: [
						{
							name: '初始化 Typora 配置',
							value: 'init',
						},
						{
							name: '查看 Typora 配置',
							value: 'show',
						},
						{
							name: '修改 Typora 配置',
							value: 'modify',
						},
						{
							name: '检测 Typora 配置是否正确',
							value: 'test',
						},
						{
							name: '查看 muc mmd typora 命令说明',
							value: 'help',
						},
					],
				},
			])
			.then(answers => {
				switch (answers.typora) {
					case 'init':
						this.typora.initConfig();
						break;
					case 'test':
						this.testTypora();
						break;
					case 'show':
						this.showTypora();
						break;
					case 'modify':
						this.modifyTypora();
						break;
					case 'help':
						exec('muc mmd typora -h', (error, stdout, stderr) => {
							if (error) {
								console.log(error);
								return;
							}
							if (stderr) {
								console.log(stderr);
								return;
							}
							if (stdout) {
								console.log(stdout);
							}
						});
						break;
					default:
						break;
				}
			});
	}
	/* File 相关 */
	/**
	 * @description 创建新文件前的提示
	 * @param fileName {string} 文件名称
	 */
	promoteCreateFile(fileName) {
		inquirer
			.prompt([
				{
					type: 'input',
					message: '请输入文件名称',
					name: 'title',
					default: fileName || this.label_default.filename,
				},
			])
			.then(async lv1 => {
				if (lv1.title === this.label_default.filename) {
					await inquirer
						.prompt([
							{
								type: 'input',
								message: '请输入作者',
								name: 'author',
								default: this.label_default.author,
							},
							{
								type: 'input',
								message: '请输入描述',
								name: 'description',
								default: this.label_default.description,
							},
						])
						.then(async lv2 => {
							await this.createFile(
								lv1.title,
								lv2.author,
								lv2.description
							);
						});
				} else {
					let label = this.checkLabel(lv1.title);
					await inquirer
						.prompt([
							{
								type: 'input',
								message: '请输入作者',
								name: 'author',
								default: label.author,
							},
							{
								type: 'input',
								message: '请输入描述',
								name: 'description',
								default: label.description,
							},
						])
						.then(async lv3 => {
							await this.createFile(
								lv1.title,
								lv3.author,
								lv3.description
							);
						});
				}
			});
	}
	/**
	 * @description 更新文件前的提示
	 * @param fileName {string} 文件名称
	 */
	async promoteUpdateFile(fileName) {
		const fileCheck = await this.mucFile.fileExist(fileName);
		if (fileCheck) {
			const hasHeader = await this.checkHeader(fileName);
			inquirer
				.prompt([
					{
						type: 'confirm',
						message: `文件 ${fileName} 已存在，未检测到文件头，是否插入文件头？`,
						name: 'insert',
						default: true,
						when: !hasHeader,
					},
					{
						type: 'confirm',
						message: `文件 ${fileName} 已存在，检测到文件头，是否更新文件头？`,
						name: 'update',
						default: true,
						when: hasHeader,
					},
				])
				.then(async answer => {
					const title = fileName.replace('.md', '');
					if (answer.insert) {
						const label = this.checkLabel(title);
						await inquirer
							.prompt([
								{
									type: 'input',
									message: '请输入作者',
									name: 'author',
									default: label.author,
								},
								{
									type: 'input',
									message: '请输入描述',
									name: 'description',
									default: label.description,
								},
							])
							.then(async input => {
								let mdModel = new MarkdownModel(
									input.author,
									input.description
								);
								await this.mucFile.insertLine(
									fileName,
									0,
									mdModel.getHeader()
								);
							});
					} else if (answer.update) {
						let mdModel = new MarkdownModel('', '');
						await this.mucFile.updateLine(
							fileName,
							10,
							await mdModel.writeHeader(fileName)
						);
					}
				});
		} else {
			inquirer
				.prompt([
					{
						type: 'confirm',
						message: `文件 ${fileName} 未存在，是否创建？`,
						name: 'create',
						default: false,
					},
				])
				.then(async answer => {
					if (answer.create) {
						const title = fileName.replace('.md', '');
						await this.promoteCreateFile(title);
					}
				});
		}
	}
	/**
	 * @description 检测文件头信息
	 * @param fileName 文件名称
	 * @returns {Promise<boolean>} 是否存在文件头信息
	 */
	async checkHeader(fileName) {
		const contentRead = await this.mucFile.readLine(fileName, 10);
		return !(contentRead.length !== 10 || contentRead[0] !== '---');
	}
	/**
	 * @description 创建文件
	 * @param {String} fileName 文件名
	 * @param {String} author 作者
	 * @param {String} description 描述
	 */
	async createFile(fileName, author, description) {
		let mdModel = new MarkdownModel(author, description);
		let mdPath = fileName + '.md';
		if (await this.mucFile.fileExist(mdPath)) {
			const hasHeader = await this.checkHeader(mdPath);
			inquirer
				.prompt([
					{
						type: 'list',
						message: `文件 ${mdPath} 已存在，未检测到文件头，执行以下操作：`,
						name: 'action',
						choices: [
							{
								name: '覆盖文件内容',
								value: 'cover',
							},
							{
								name: '插入文件头',
								value: 'insert',
							},
						],
						when: !hasHeader,
						default: 'insert',
					},
					{
						type: 'list',
						message: `文件 ${mdPath} 已存在，检测到文件头，执行以下操作：`,
						name: 'action',
						choices: [
							{
								name: '覆盖文件内容',
								value: 'cover',
							},
							{
								name: '更新文件头',
								value: 'update',
							},
							{
								name: '不执行任何操作',
								value: 'none',
							},
						],
						when: hasHeader,
						default: 'none',
					},
				])
				.then(async answer => {
					if (answer.action === 'cover') {
						await this.mucFile.writeFile(
							mdPath,
							mdModel.getHeader()
						);
					} else if (answer.action === 'insert') {
						await this.mucFile.insertLine(
							mdPath,
							0,
							mdModel.getHeader()
						);
					} else if (answer.action === 'update') {
						await this.mucFile.updateLine(
							mdPath,
							10,
							await mdModel.writeHeader(mdPath)
						);
					}
				});
		} else {
			await this.mucFile.createFile(mdPath, mdModel.getHeader());
		}
	}
	/* Label 相关 */
	/**
	 * @description 检查文件名是否在配置中
	 * @param {String} fileName 文件名
	 * @returns {Object} 是否在配置中 | 配置信息
	 */
	checkLabel(fileName) {
		const label = this.label.custom;
		const defaultLabel = {
			author: this.label_default.author,
			description: fileName,
		};
		// 判断label是否为空
		if (label === null) {
			return defaultLabel;
		}
		for (let i = 0; i < label.length; i++) {
			let labelGet = label[i];
			if (labelGet.filename === fileName) {
				return labelGet;
			}
		}
		return defaultLabel;
	}
	/**
	 * @description 获取 markdown label
	 * @param {String} fileName 文件名
	 */
	getLabel(fileName = 'all') {
		let label = this.label;
		if (fileName === 'all') {
			console.log(label);
		} else {
			let labelCheck = this.checkLabel(fileName);
			if (labelCheck.author !== undefined) {
				console.log(labelCheck);
			} else {
				inquirer
					.prompt([
						{
							type: 'confirm',
							message: `模板 ${fileName} 不存在，是否创建？`,
							name: 'choice',
							default: false,
						},
					])
					.then(answer => {
						if (answer.choice) {
							this.addLabel(fileName);
						}
					});
			}
		}
	}
	/**
	 * @description 添加 markdown label
	 * @param {String} fileName 文件名
	 */
	addLabel(fileName) {
		let labelCheck = this.checkLabel(fileName);
		if (labelCheck.author !== undefined) {
			console.log(`模板 ${fileName} 已存在！`);
		} else {
			inquirer
				.prompt([
					{
						type: 'input',
						message: '请输入作者',
						name: 'author',
						default: this.label_default.author,
					},
					{
						type: 'input',
						message: '请输入描述',
						name: 'description',
						default: this.label_default.description,
					},
				])
				.then(label => {
					const labelGet = {
						author: label.author,
						filename: fileName,
						description: label.description,
					};
					console.log(labelGet);
					inquirer
						.prompt([
							{
								type: 'confirm',
								message: `是否添加到自定义模板？`,
								name: 'choice',
								default: false,
							},
						])
						.then(answer => {
							if (answer.choice) {
								let labelCustom = this.label.custom;
								if (
									labelCustom === undefined ||
									labelCustom === null
								) {
									labelCustom = [];
								}
								labelCustom.push(labelGet);
								this.changeLabel(labelCustom);
							}
						});
				});
		}
	}
	/**
	 * @description 删除 markdown label
	 * @param {String} fileName 文件名
	 */
	delLabel(fileName) {
		let labelCheck = this.checkLabel(fileName);
		if (labelCheck.author === undefined) {
			console.log(`模板 ${fileName} 不存在！`);
		} else {
			console.log(labelCheck);
			inquirer
				.prompt([
					{
						type: 'confirm',
						message: `是否删除模板 ${fileName}？`,
						name: 'choice',
						default: false,
					},
				])
				.then(answer => {
					if (answer.choice) {
						let labelCustom = this.label.custom;
						labelCustom = labelCustom.filter(
							item => item.fileName !== fileName
						);
						this.changeLabel(labelCustom);
					}
				});
		}
	}
	/**
	 * @description 将 markdown label 写入文件
	 * @param {Array} labelCustom 自定义模板
	 */
	changeLabel(labelCustom) {
		new Config().changeConfig(['mmd', 'label'], 'custom', labelCustom);
	}
}

export default Markdown;
