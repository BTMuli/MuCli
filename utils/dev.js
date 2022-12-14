/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 dev 的具体实现
 * @update: 2022-12-13
 */

/* Node */
import inquirer from 'inquirer';
/* MuCli */
import MucFile from './file.js';
import DevModel from '../config/dev.js';
import { PROJECT_INFO, ROOT_PATH } from '../config.js';

class Dev {
	/**
	 * @description: 创建新的子命令
	 * @param name {String} 子命令名称
	 */
	createNew(name) {
		let mucFile = new MucFile();
		inquirer
			.prompt([
				{
					type: 'input',
					message: '请输入 SubCommand 名称',
					name: 'name',
					default: name || 'test',
				},
				{
					type: 'input',
					message: '请输入 SubCommand 命令',
					name: 'command',
					default: name || 'test',
				},
				{
					type: 'input',
					message: '请输入 SubCommand 简介',
					name: 'desc',
					default: 'A SubCommand within MuCli for ' + name,
				},
			])
			.then(async answers => {
				let dev = new DevModel(
					answers.name,
					answers.command,
					answers.desc
				);
				const paths = dev.getFilesPath();
				for (const p in paths) {
					await mucFile.writeFile(paths[p], dev.getModel(p));
				}
				this.updatePackage(answers.command, '0.0.1');
			});
	}
	/**
	 * @description: 更新子命令版本号
	 * @param name {String} 子命令名称
	 * @param version {String} 子命令版本号
	 */
	updateVersion(name, version) {
		let subInfo = PROJECT_INFO['subversion'];
		if (subInfo[name]) {
			inquirer
				.prompt([
					{
						type: 'input',
						message: `请输入新的 ${name} 版本号`,
						name: 'version',
						default: version || subInfo[name],
					},
				])
				.then(answers => {
					let reg = /^(\d+\.){2}\d+$/;
					if (!reg.test(answers.version)) {
						console.log('版本号格式不正确');
						return;
					}
					this.updatePackage(name, answers.version);
					console.log(
						'版本号更新成功，当前版本号为：' + answers.version
					);
				});
		} else {
			inquirer
				.prompt([
					{
						type: 'confirm',
						message: '未找到该子命令，是否创建新的子命令？',
						name: 'create',
						default: true,
					},
				])
				.then(answers => {
					if (answers.create) {
						this.createNew(name);
					}
				});
		}
	}
	/**
	 * @description: 更新/新增 package.json 中的子命令
	 * @param name {String} 子命令名称
	 * @param version {String} 子命令版本号
	 */
	updatePackage(name, version) {
		let projInfo = PROJECT_INFO;
		let subInfo = projInfo['subversion'];
		subInfo[name] = version;
		let mucFile = new MucFile();
		projInfo = JSON.stringify(projInfo, null, 4);
		mucFile.writeFile(ROOT_PATH + '/package.json', projInfo);
	}
}

export default Dev;
