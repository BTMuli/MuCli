/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 主命令文件
 * @update: 2022-12-14
 */

/* Node */
import { Command } from 'commander';
/* MuCli */
import { PROJECT_INFO } from '../config.js';
import Config, { COMMAND_LIST } from '../config/index.js';

/* 版本管理 */
const MuCliVersion = PROJECT_INFO.version;

const MuCli = new Command();

/* 基本信息 */
MuCli.name('muc')
	.version(MuCliVersion, '-v, --version')
	.description('A Node Cli for Personal Use by BTMUli.');

/* 查看子命令信息 */
MuCli.option('-l, --list', 'list all commands').action(options => {
	if (options.list) {
		let muc = new Config();
		let commandList = [];
		commandList['muc'] = {
			version: MuCliVersion,
			enable: true,
			description: MuCli.description(),
		};
		COMMAND_LIST.forEach(command => {
			commandList[command.name()] = {
				version: command.version(),
				enable: muc.commandUse(command),
				description: command.description(),
			};
		});
		console.table(commandList);
	} else {
		MuCli.help();
	}
});

/* 选用/弃用子命令 */
MuCli.command('set')
	.option('-n, --name <name>', 'see and set [name]', 'all')
	.option('-t, --target <status>', 'set [target] to [status]', 'on')
	.description('change subcommand use status')
	.action(options => {
		let muc = new Config();
		/* 更新配置 */
		muc.transConfig(options.name, options.target);
		/* 读取配置 */
		muc.loadConfig(MuCli);
	});

export default MuCli;
