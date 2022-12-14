/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 dev 的具体实现
 * @update: 2022-12-14
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
	 * @description: 更新命令版本号，包括主命令和子命令
	 */
	updateVersion() {
		let subCommandsArr = Object.keys(PROJECT_INFO['subversion']).map(
			key => {
				return {
					name: `${key}(${PROJECT_INFO['subversion'][key]})`,
					value: key,
				};
			}
		);
		inquirer
			.prompt([
				{
					type: 'list',
					message: '请选择要更新的命令',
					name: 'name',
					choices: [
						{
							name: `muc(${PROJECT_INFO['version']})`,
							value: 'all',
						},
						...subCommandsArr,
					],
				},
			])
			.then(answers => {
				if (answers.name === 'all') {
					this.updateMucVersion();
				} else {
					this.updateSubVersion(answers.name);
				}
			});
	}
	/**
	 * @description: 检查版本号是否合法
	 * @param version {String} 版本号
	 * @return {Boolean} 是否合法
	 */
	checkVersion(version) {
		let reg = /^(\d+\.){2}\d+$/;
		return reg.test(version);
	}
	/**
	 * @description: 更新 主命令 版本号
	 */
	updateMucVersion() {
		let mucVersion = PROJECT_INFO.version;
		inquirer
			.prompt([
				{
					type: 'input',
					message: `请输入新的 MuCli 版本号`,
					name: 'version',
					default: mucVersion,
				},
			])
			.then(answers => {
				if (!this.checkVersion(answers.version)) {
					console.log('版本号不合法');
					return;
				}
				this.updatePackage('all', answers.version);
				if (answers.version !== mucVersion) {
					console.log(
						`\n版本号已更新 ${mucVersion} -> ${answers.version}`
					);
					console.log('请运行 npm install 更新依赖\n');
				} else {
					console.log(
						`\n版本号未变化，当前 MuCli 版本为 ${answers.version}\n`
					);
				}
			});
	}
	/**
	 * @description: 更新 子命令 版本号
	 * @param name {String} 子命令名称
	 */
	updateSubVersion(name) {
		let subInfo = PROJECT_INFO['subversion'];
		if (subInfo[name]) {
			inquirer
				.prompt([
					{
						type: 'input',
						message: `请输入新的 ${name} 版本号`,
						name: 'version',
						default: subInfo[name],
					},
				])
				.then(answers => {
					if (!this.checkVersion(answers.version)) {
						console.log('版本号格式不正确');
						return;
					}
					this.updatePackage(name, answers.version);
					if (answers.version !== subInfo[name]) {
						console.log(
							`\n版本号已更新 ${subInfo[name]} -> ${answers.version}`
						);
					} else {
						console.log(
							`\n版本号未更新，当前 ${name} 版本号为 ${subInfo[name]}\n`
						);
					}
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
		if (name === 'all') {
			projInfo.version = version;
		} else {
			projInfo['subversion'][name] = version;
		}
		let mucFile = new MucFile();
		projInfo = JSON.stringify(projInfo, null, 4);
		mucFile.writeFile(ROOT_PATH + '/package.json', projInfo);
	}
}

export default Dev;
