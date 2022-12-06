/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 dev 的具体实现
 * @update: 2022-12-06
 */

/* Node */
import inquirer from 'inquirer';
/* MuCli */
import MucFile from './file.js';
import DevModel from '../config/dev.js';

class Dev {
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
			});
	}
}

export default Dev;
