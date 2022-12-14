/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-14
 * @description: typora 相关操作
 * @update: 2021-12-14
 */

/* Node */
import * as os from 'os';
import inquirer from 'inquirer';
import { resolve } from 'node:path';
import { exec, execFile } from 'node:child_process';
/* MuCli */
import Config from '../config/index.js';

class Typora {
	constructor(typora) {
		this.config = new Config();
		this.enable = typora.enable;
		this.path = typora.path;
	}
	/**
	 * @description 初始化配置
	 */
	initConfig() {
		const system = os.platform();
		inquirer
			.prompt([
				{
					type: 'list',
					name: 'typora',
					message: '请选择你的 Typora 配置情况',
					choices: [
						{
							name: '非 windows 系统，未安装 Typora',
							value: 'none',
						},
						{
							name: '非 windows 系统，已安装 Typora',
							value: 'not_windows',
						},
						{
							name: 'windows 系统，未安装 Typora',
							value: 'windows_none',
						},
						{
							name: 'windows 系统，已安装 Typora',
							value: 'windows',
						},
					],
					default: system === 'win32' ? 'windows_none' : 'none',
				},
			])
			.then(answersF => {
				switch (answersF.typora) {
					case 'none':
						// 非 windows 系统，未安装 Typora
						this.changeConfig(false, '');
						break;
					case 'not_windows':
						// 非 windows 系统，已安装 Typora
						inquirer
							.prompt([
								{
									name: 'check',
									type: 'confirm',
									message:
										'本命令行工具不支持非 windows 系统下的 Typora,但是你可以手动配置 Typora 的路径,是否手动配置?',
									default: false,
								},
							])
							.then(answersS => {
								if (answersS.check) {
									this.manualTypora();
								}
							});
						break;
					case 'windows_none':
						// windows 系统，未安装 Typora
						inquirer
							.prompt([
								{
									name: 'check',
									type: 'confirm',
									message:
										'本命令行建议使用 Typora 编辑器,是否安装 Typora?',
									default: false,
								},
							])
							.then(answersS => {
								if (answersS.check) {
									console.log(
										'请手动安装 Typora，官网地址：https://typora.io/'
									);
									console.log(
										'安装完成后，重新运行本命令行工具'
									);
								} else {
									this.changeConfig(false, '');
								}
							});
						break;
					case 'windows':
						// windows 系统，已安装 Typora
						inquirer
							.prompt([
								{
									name: 'check',
									type: 'confirm',
									message:
										'本命令行建议使用 Typora 编辑器,是否使用 Typora?',
									default: true,
								},
							])
							.then(answersS => {
								if (answersS.check) {
									this.findTypora();
								}
							});
						break;
					default:
						break;
				}
			});
	}
	/**
	 * @description 展示配置
	 */
	showConfig() {
		console.log('\n当前系统：' + os.platform());
		if (this.enable) {
			console.log('Typora 已启用');
			console.log(`Typora 路径：${this.path}\n`);
		} else {
			console.log('Typora 未启用\n');
		}
	}
	/**
	 * @description: 获取配置
	 * @return {Object} 配置对象
	 */
	getConfig() {
		return {
			enable: this.enable,
			path: this.path,
		};
	}
	/**
	 * @description 检测配置是否正确
	 */
	verifyConfig() {
		const system = os.platform();
		if (system === 'win32' && this.enable === false) {
			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'enable',
						message: '检测到当前系统为 Windows，是否启用 Typora？',
						default: true,
					},
				])
				.then(answers => {
					if (answers.enable) {
						this.findTypora();
					}
				});
		} else if (system !== 'win32' && this.enable === true) {
			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'enable',
						message:
							'目前仅支持 Windows 系统，建议关闭 Typora 配置。\n' +
							'是否更新配置文件？',
						default: true,
					},
				])
				.then(answers => {
					if (answers.enable) {
						this.changeConfig(false);
					}
				});
		}
	}
	/**
	 * @description 修改配置
	 * @param {string} enable Typora开关
	 * @param {string} path Typora路径
	 */
	changeConfig(enable, path = undefined) {
		console.log('\n正在更新配置文件...');
		this.enable = enable;
		this.path = path === undefined ? this.path : path;
		this.saveConfig();
		console.log('\n更新完成');
		this.showConfig();
	}
	/**
	 * @description 保存配置到配置文件
	 */
	saveConfig() {
		const typoraInfo = this.getConfig();
		this.config.changeConfig(['mmd'], 'typora', typoraInfo);
	}
	/**
	 * @description 查找本地Typora
	 * @return {string} typoraPath
	 */
	findTypora() {
		const query =
			'REG QUERY "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Typora.exe"';
		exec(query, (error, stdout, stderr) => {
			if (error) {
				console.log('error: ' + error);
				return;
			}
			if (stderr) {
				console.log('stderr: ' + stderr);
				return;
			}
			// 如果没有找到Typora
			if (stdout.indexOf('ERROR') !== -1) {
				inquirer
					.prompt([
						{
							type: 'confirm',
							name: 'enable',
							message:
								'未找到 Typora，是否手动指定 Typora 路径？',
							default: true,
						},
					])
					.then(answers => {
						if (answers.enable) {
							this.manualTypora();
						}
					});
			}
			const typoraPath = stdout.split('REG_SZ')[1].trim();
			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'path',
						message:
							`检测到本地 Typora 路径与配置文件不一致，是否更新配置文件？\n` +
							`当前路径：${typoraPath}\n` +
							`配置文件路径：${this.path}`,
						default: true,
						when: this.path !== typoraPath,
					},
					{
						type: 'confirm',
						name: 'enable',
						message:
							`检测到本地 Typora 路径与配置文件一致，是否启用 Typora？\n` +
							`当前路径：${typoraPath}\n` +
							`配置文件路径：${this.path}`,
						default: true,
						when: this.path === typoraPath,
					},
				])
				.then(answers => {
					if (answers.path) {
						this.changeConfig(true, typoraPath);
					} else if (answers.enable) {
						this.changeConfig(true);
					}
				});
		});
	}
	/**
	 * @description 通过Typora打开文件
	 * @param {string} fileName 文件名
	 */
	openFile(fileName) {
		if (this.enable) {
			const filePath = resolve() + '\\' + fileName;
			execFile(this.path, [filePath], err => {
				if (err) {
					console.log(err);
				}
			});
		} else {
			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'enable',
						message: '未启用 Typora，是否启用？',
						default: true,
					},
				])
				.then(answers => {
					if (answers.enable) {
						this.verifyConfig();
					}
				});
		}
	}
	/**
	 * @description 手动指定 Typora 路径
	 */
	manualTypora() {
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'path',
					message: '请输入 Typora 的安装路径',
					default: this.path,
				},
			])
			.then(answers => {
				this.changeConfig(true, answers.path);
			});
	}
}

export default Typora;
