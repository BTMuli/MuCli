/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: markdown 文件相关操作
 */

/* Node */
import inquirer from 'inquirer';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
/* MuCli */
import MarkdownModel from '../config/markdown.js';
import MucFile from './file.js';
import Config from '../config/index.js';

class Markdown {
	constructor() {
		const markdownConfig = new Config().readConfigDetail('mmd');
		this.label = markdownConfig.label;
		this.label_default = markdownConfig.label.default;
		this.typora = markdownConfig.typora;
		this.mucFile = new MucFile();
	}
	/**
	 * 获取 Typora 相关配置
	 * @returns {Object} Typora 相关配置
	 */
	getConfigTypora() {
		console.log(`\n${this.typora.enable ? '已' : '未'}启用 Typora`);
		if (this.typora.enable) {
			console.log(`Typora 路径：${this.typora.path}\n`);
		}
	}
	/**
	 * 检查文件名是否在配置中
	 * @param {String} fileName 文件名
	 * @returns {Object} 是否在配置中 | 配置信息
	 */
	checkLabel(fileName) {
		const label = this.label.custom;
		const emptyLabel = {
			author: undefined,
			description: undefined,
		};
		// 判断label是否为空
		if (label === null) {
			return emptyLabel;
		}
		for (let i = 0; i < label.length; i++) {
			let labelGet = label[i];
			if (labelGet.filename === fileName) {
				return labelGet;
			}
		}
		return emptyLabel;
	}
	/**
	 * 创建新文件前的提示
	 * @param fileName 文件名称
	 */
	promoteFile(fileName) {
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
								default:
									label.author || this.label_default.author,
							},
							{
								type: 'input',
								message: '请输入描述',
								name: 'description',
								default:
									label.description ||
									this.label_default.description,
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
	 * 创建文件
	 * @param {String} fileName 文件名
	 * @param {String} author 作者
	 * @param {String} description 描述
	 */
	async createFile(fileName, author, description) {
		let mdModel = new MarkdownModel(author, description);
		let mdPath = fileName + '.md';
		if (await this.mucFile.fileExist(mdPath)) {
			inquirer
				.prompt([
					{
						type: 'confirm',
						message: `文件 ${mdPath} 已存在，是否覆盖？`,
						name: 'choice',
						default: false,
					},
				])
				.then(async answer => {
					if (answer.choice) {
						await this.mucFile.writeFile(
							mdPath,
							mdModel.getLabel()
						);
					}
				});
		} else {
			await this.mucFile.createFile(mdPath, mdModel.getLabel());
		}
	}
	/**
	 * 调用 Typora 打开文件
	 * @param fileName 文件名称
	 */
	openTypora(fileName) {
		if (this.typora.enable) {
			const filePath = resolve() + '\\' + fileName;
			execFile(this.typora.path, [filePath], err => {
				if (err) {
					console.log(err);
				}
			});
		} else {
			console.log('Typora 模块未加载！');
		}
	}
	/**
	 * 获取 markdown label
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
	 * 添加 markdown label
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
	 * 删除 markdown label
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
	 * 将 markdown label 写入文件
	 * @param {Array} labelCustom 自定义模板
	 */
	changeLabel(labelCustom) {
		new Config().changeConfig(['mmd', 'label'], 'custom', labelCustom);
	}
}

export default Markdown;
