/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 dev 的具体实现
 * @update: 2022-12-15
 */

/* Node */
import inquirer from 'inquirer';
/* MuCli */
import MucFile from './file.js';
import DevModel from '../config/dev.js';
import { PROJECT_INFO, ROOT_PATH } from '../config.js';

class Dev {
	/**
	 * @description 创建新的子命令
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
	 * @description 更新命令版本号，包括主命令和子命令
	 */
	updateVersion() {
		let subCommandsArr = Object.keys(PROJECT_INFO['subversion']).map(
			key => {
				return {
					name: `${key}(${PROJECT_INFO['subversion'][key]})`,
					value: [key, PROJECT_INFO['subversion'][key]],
				};
			}
		);
		inquirer
			.prompt([
				{
					type: 'list',
					message: '请选择要更新的命令',
					name: 'command',
					choices: [
						{
							name: `muc(${PROJECT_INFO['version']})`,
							value: ['muc', PROJECT_INFO['version']],
						},
						...subCommandsArr,
						{
							name: '不更新任何命令',
							value: ['null'],
						},
					],
				},
			])
			.then(lv1 => {
				if (lv1.command[0] !== 'null') {
					const oldVersion = lv1.command[1];
					inquirer
						.prompt([
							{
								type: 'list',
								name: 'version',
								message: `请选择新的 ${lv1.command[0]} 版本号：`,
								choices: [
									...this.getUpVersion(oldVersion),
									{
										name: '手动输入',
										value: 'input',
									},
									{
										name: '不更新版本',
										value: oldVersion,
									},
								],
							},
							{
								type: 'input',
								name: 'input',
								message: `请输入新的 ${lv1.command[0]} 版本号：`,
								when: lv2 => lv2.version === 'input',
							},
						])
						.then(lv2 => {
							const upVersion =
								lv2.version === 'input'
									? lv2.input
									: lv2.version;
							if (lv1.command[0] === 'muc') {
								this.updateMucVersion(upVersion);
							} else {
								this.updateSubVersion(
									lv1.command[0],
									upVersion
								);
							}
						});
				} else {
					console.log('\n未更新任何命令\n');
				}
			});
	}
	/**
	 * @description 获取新版本号
	 * @param {string} oldVersion 旧版本号
	 * @return {Array<string>} 新版本号
	 */
	getUpVersion(oldVersion) {
		// 0.0.1 -> 0.0.2
		const sVersion = oldVersion
			.split('.')
			.map((value, index) => {
				if (index === 2) {
					return Number(value) + 1;
				}
				return Number(value);
			})
			.join('.');
		// 0.0.1 -> 0.1.0
		const mVersion = oldVersion
			.split('.')
			.map((value, index) => {
				if (index === 1) {
					return Number(value) + 1;
				}
				if (index > 1) {
					return 0;
				}
				return Number(value);
			})
			.join('.');
		// 0.0.1 -> 1.0.0
		const lVersion = oldVersion
			.split('.')
			.map((value, index) => {
				if (index === 0) {
					return Number(value) + 1;
				}
				return 0;
			})
			.join('.');
		return [
			{
				name: sVersion,
				value: sVersion,
			},
			{
				name: mVersion,
				value: mVersion,
			},
			{
				name: lVersion,
				value: lVersion,
			},
		];
	}
	/**
	 * @description 检查版本号是否合法
	 * @param version {String} 新版本号
	 * @param oldVersion {String} 旧版本号
	 * @return {Boolean} 是否合法
	 */
	checkVersion(version, oldVersion) {
		const reg = /^(\d+\.){2}\d+$/;
		if (!reg.test(version)) {
			console.log('\n版本号格式不正确\n');
			return false;
		}
		if (version < oldVersion) {
			console.log('\n新版本号不能小于旧版本号\n');
			return false;
		}
		return true;
	}
	/**
	 * @description 更新 主命令 版本号
	 * @param upVersion {string} 新的版本号
	 */
	updateMucVersion(upVersion) {
		const oldVersion = PROJECT_INFO.version;
		if (!this.checkVersion(upVersion, oldVersion)) {
			return;
		}
		this.updatePackage('all', upVersion);
		if (upVersion !== oldVersion) {
			console.log(`\n版本号已更新 ${oldVersion} -> ${upVersion}`);
			console.log('请运行 npm install 更新依赖\n');
		} else {
			console.log(`\n版本号未更新，当前 MuCli 版本为 ${oldVersion}\n`);
		}
	}
	/**
	 * @description 更新 子命令 版本号
	 * @param name {String} 子命令名称
	 * @param upVersion {string} 新的版本号
	 */
	updateSubVersion(name, upVersion) {
		let subInfo = PROJECT_INFO['subversion'];
		const oldVersion = subInfo[name];
		if (!this.checkVersion(upVersion, oldVersion)) {
			return;
		}
		this.updatePackage(name, upVersion);
		if (upVersion !== oldVersion) {
			console.log(`\n版本号已更新 ${oldVersion} -> ${upVersion}\n`);
		} else {
			console.log(
				`\n版本号未更新，当前 ${name} 版本号为 ${oldVersion}\n`
			);
		}
	}
	/**
	 * @description 更新/新增 package.json 中的子命令
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
