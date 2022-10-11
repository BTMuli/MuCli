// Node JS
import inquirer from 'inquirer';
// MuCli JS
import MucFile from './file.js';
import SubCommandModel from '../config/SubCommand.js';

class SubCommand {
	createNew(name) {
		var mucFile = new MucFile();
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
					default: 'test',
				},
				{
					type: 'input',
					message: '请输入 SubCommand 简介',
					name: 'desc',
					default: 'A SubCommand within MuCli for Test',
				},
			])
			.then(async answers => {
				var subC = new SubCommandModel(
					answers.name,
					answers.command,
					answers.desc
				);
				var paths = subC.getFilesPath();
				for (var p in paths) {
					await mucFile.fileRewriteCheck(
						paths[p],
						subC.getModel(p),
						inquirer
					);
				}
			});
	}
}

export default SubCommand;
