/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: pip 镜像源相关操作
 */

/* Node */
import { exec } from 'child_process';
/* MuCli */
import { PipModel, MirrorModel } from '../config/pip.js';
import Config from '../config/index.js';
import inquirer from 'inquirer';

class Pip {
	constructor() {
		const pipConfig = new Config().readConfigDetail('pip');
		this.pipConfig = new Config();
		let mirrorList = [];
		let mirrorUse = undefined;
		for (let i = 0; i < pipConfig.mirrorList.length; i++) {
			let mirror = new MirrorModel(pipConfig.mirrorList[i]);
			if (mirror.usable === true && mirrorUse === undefined) {
				mirrorUse = mirror;
			}
			mirrorList.push(mirror);
		}
		if (mirrorUse === undefined) {
			mirrorUse = this.mirrorInfo[0];
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
							default: true,
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
			mirrorListTest.sort(function (a, b) {
				if (a.time === -1) {
					return 1;
				}
				if (b.time === -1) {
					return -1;
				}
				return a.time - b.time;
			});
			for (let i = 0; i < mirrorListTest.length; i++) {
				delete mirrorListTest[i].time;
			}
			this.mirrorInfo.mirrorList = mirrorListTest;
			console.log('正在写入配置文件...');
			this.pipConfig.changeConfig(
				['pip'],
				'mirrorList',
				this.mirrorInfo.mirrorList
			);
			console.log('写入配置文件成功');
		}
	}
	/**
	 * 安装包
	 * @param args
	 */
	install(args) {
		const url = this.mirrorInfo.useMirror.url;
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
