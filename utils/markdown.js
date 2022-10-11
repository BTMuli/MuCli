// Node JS
import inquirer from 'inquirer';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
// MuCli JS
import MarkdownModel from '../config/markdown.js';
import MucFile from './file.js';
import Config from '../config/index.js';

var markdownConfig = new Config().readDetailConfig('Commands', 'mmd');

class Markdown {
	/**
	 * 初始化构建各种设置
	 */
	constructor() {
		this.configAll = markdownConfig;
		this.authorDefault = markdownConfig.default.author;
		this.fileDefault = markdownConfig.default.filename;
		this.descDefault = markdownConfig.default.description;
		this.typora = markdownConfig.typora;
		if (this.typora.enable) {
			this.typoraPath = this.typora.path;
		}
	}

	/*
	 * 获取各种配置
	 */
	getConfigAll() {
		return this.configAll;
	}

	getConfigTypora() {
		return this.typora;
	}

	/**
	 * 创建新文件
	 * @param name 文件名称
	 */
	createNew(name) {
		var mucFile = new MucFile();
		inquirer
			.prompt([
				{
					type: 'input',
					message: '请输入文件名称',
					name: 'title',
					default: name || this.fileDefault,
				},
				{
					type: 'input',
					message: '请输入作者',
					name: 'author',
					default: this.authorDefault,
				},
				{
					type: 'input',
					message: '请输入描述',
					name: 'desc',
					default:
						name === this.fileDefault ? this.descDefault : name,
				},
			])
			.then(async answers => {
				var mdModel = new MarkdownModel(answers.author, answers.desc);
				var mdPath = answers.title + '.md';
				await mucFile.fileRewriteCheck(
					mdPath,
					mdModel.getModel(),
					inquirer
				);
			});
	}

	/**
	 * 调用 Typora 打开文件
	 */
	openTypora(name) {
		if (this.typoraPath) {
			var filePath = resolve() + '\\' + name;
			execFile(this.typoraPath, [filePath], function (err, data) {
				if (err) {
					throw err;
				}
				console.log(data.toString());
			});
		} else {
			console.log('Typora 模块未加载！');
		}
	}
}

export default Markdown;
