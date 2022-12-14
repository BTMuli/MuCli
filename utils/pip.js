/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: pip 镜像源相关操作
 * @update: 2021-12-14
 */

/* Node */
import { exec } from 'child_process';
import inquirer from 'inquirer';
/* MuCli */
import { PipModel, MirrorModel } from '../config/pip.js';
import Config from '../config/index.js';

class Pip {
	constructor() {
		const pipConfig = new Config().readConfigDetail('pip');
		this.pipConfig = new Config();
		let mirrorUse = pipConfig.mirrorUse;
		let mirrorList = [];
		for (let i = 0; i < pipConfig.mirrorList.length; i++) {
			const mirrorModel = new MirrorModel(pipConfig.mirrorList[i]);
			mirrorList.push(mirrorModel);
		}
		this.mirrorInfo = new PipModel(mirrorUse, mirrorList);
	}
	/**
	 * 测试镜像源
	 * @param {String} mirror 镜像源名称
	 */
	async verifyMirror(mirror = undefined) {
		if (mirror !== undefined) {
			if (this.mirrorInfo.checkMirrorExist(mirror) === false) {
				inquirer
					.prompt([
						{
							type: 'confirm',
							name: 'confirm',
							message: `镜像源 ${mirror} 不存在，是否添加？`,
							default: false,
						},
					])
					.then(async answer => {
						if (answer.confirm === true) {
							await this.addMirror(mirror);
						}
					});
			} else {
				this.mirrorInfo.testMirror(mirror);
			}
		} else {
			let mirrorListTest = this.mirrorInfo.mirrorList;
			for (let i = 0; i < mirrorListTest.length; i++) {
				mirror = mirrorListTest[i].name;
				let result = await this.mirrorInfo.testMirror(mirror);
				mirrorListTest[i].usable = result !== -1;
				mirrorListTest[i].time = result;
			}
			// 排除不可用的镜像源后，获取最快的镜像源
			const fastestMirror = mirrorListTest
				.filter(item => item.time !== -1)
				.reduce((prev, curr) => {
					return prev.time < curr.time ? prev : curr;
				});
			// 获取当前使用的镜像源
			const currentMirror = this.mirrorInfo.mirrorList.find(mirror => {
				return mirror.name === this.mirrorInfo.mirrorUse;
			});
			// 输出结果
			console.log(
				`\n测试镜像源数量：${mirrorListTest.length}，可用镜像源数量：${
					mirrorListTest.filter(mirror => mirror.usable === true)
						.length
				}`
			);
			console.log(
				`\n当前使用镜像源：${currentMirror.name}，${
					currentMirror.url
				}，${
					currentMirror.time === -1
						? '不可用'
						: '耗时：' + currentMirror.time + 'ms'
				}`
			);
			console.log(
				`\n最快镜像源：${fastestMirror.name}，${fastestMirror.url}，耗时：${fastestMirror.time}ms\n`
			);
			if (fastestMirror.name !== currentMirror.name) {
				await inquirer
					.prompt([
						{
							type: 'confirm',
							name: 'confirm',
							message: `是否切换到最快的镜像源 ${fastestMirror.name}？\n`,
							default: false,
						},
					])
					.then(async answer => {
						if (answer.confirm === true) {
							await this.mirrorInfo.setUseMirror(
								fastestMirror.name
							);
						}
						this.pipConfig.changeConfig(
							['pip'],
							'mirrorUse',
							this.mirrorInfo.mirrorUse
						);
					});
			}
			await inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'confirm',
						message: '是否更新配置文件？\n',
						default: false,
					},
				])
				.then(async answer => {
					if (answer.confirm === true) {
						for (let i = 0; i < mirrorListTest.length; i++) {
							delete mirrorListTest[i].time;
						}
						console.log('\n正在更新配置文件...');
						this.pipConfig.changeConfig(
							['pip'],
							'mirrorList',
							mirrorListTest
						);
						console.log('\n更新配置文件成功!\n');
					}
				});
		}
	}
	/**
	 * 安装包
	 * @param args
	 */
	install(args) {
		const url = this.mirrorInfo.getUseMirror().url;
		let command = '';
		let venv = process.env.VIRTUAL_ENV;
		if (venv !== undefined) {
			venv = venv + '\\Scripts\\pip.exe';
		} else {
			venv = 'pip';
		}
		if (args.package !== undefined) {
			// 在虚拟环境中安装包
			command = venv + ' install ' + args.package + ' -i ' + url;
		} else if (args.requirement !== undefined) {
			command = venv + ' install -r ' + args.requirement + ' -i ' + url;
		}
		console.log('command:\t' + command);
		exec(command);
	}
	/**
	 * 查看镜像源
	 */
	listMirror() {
		this.mirrorInfo.getUseMirror();
		this.mirrorInfo.getMirrorList();
	}
	/**
	 * 添加镜像源
	 * @param {String} mirrorName 镜像源名称
	 */
	async addMirror(mirrorName) {
		if (this.mirrorInfo.checkMirrorExist(mirrorName) === false) {
			let mirror = await inquirer.prompt([
				{
					type: 'input',
					name: 'name',
					message: '请输入镜像源地址',
					default: mirrorName,
				},
				{
					type: 'input',
					name: 'url',
					message: '请输入镜像源地址',
				},
			]);
			await this.mirrorInfo.addMirror(mirror.name, mirror.url);
			console.log('正在写入配置文件...');
			this.pipConfig.changeConfig(
				['pip'],
				'mirrorList',
				this.mirrorInfo.mirrorList
			);
			console.log('写入配置文件成功');
		} else {
			console.log('镜像源已存在');
		}
	}
	/**
	 * 删除镜像源
	 * @param {String} mirrorName 镜像源名称
	 */
	async deleteMirror(mirrorName) {
		if (this.mirrorInfo.checkMirrorExist(mirrorName) === true) {
			inquirer
				.prompt([
					{
						type: 'confirm',
						name: 'confirm',
						message: `是否删除镜像源 ${mirrorName}？`,
						default: false,
					},
				])
				.then(async answer => {
					if (answer.confirm === true) {
						await this.mirrorInfo.deleteMirror(mirrorName);
						console.log('正在写入配置文件...');
						this.pipConfig.changeConfig(
							['pip'],
							'mirrorList',
							this.mirrorInfo.mirrorList
						);
						console.log('写入配置文件成功');
					}
				});
		} else {
			console.log('镜像源不存在');
		}
	}
	/**
	 * 设置使用镜像源
	 * @param {String} mirrorName 镜像源名称
	 */
	async setMirror(mirrorName) {
		if (this.mirrorInfo.checkMirrorExist(mirrorName) === true) {
			await this.mirrorInfo.setUseMirror(mirrorName);
			console.log('正在写入配置文件...');
			this.pipConfig.changeConfig(
				['pip'],
				'useMirror',
				this.mirrorInfo.useMirror
			);
			console.log('写入配置文件成功');
		} else {
			console.log('镜像源不存在');
		}
	}
	/**
	 * 更新镜像源
	 * @param {String} mirrorName 镜像源名称
	 */
	async updateMirror(mirrorName) {
		if (this.mirrorInfo.checkMirrorExist(mirrorName) === true) {
			let url = await inquirer.prompt([
				{
					type: 'input',
					name: 'url',
					message: '请输入镜像源地址',
				},
			]);
			url = url.url;
			await this.mirrorInfo.updateMirror(mirrorName, url);
			console.log('正在写入配置文件...');
			this.pipConfig.changeConfig(
				['pip'],
				'mirrorList',
				this.mirrorInfo.mirrorList
			);
			console.log('写入配置文件成功');
		} else {
			console.log('镜像源不存在');
		}
	}
}

export default Pip;
