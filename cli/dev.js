/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 创建子命令相关
 * @update: 2022-12-14
 */

/* Node */
import { Command } from 'commander';
/* MuCli */
import Dev from '../utils/dev.js';
import { PROJECT_INFO } from '../config.js';

/* 版本管理 */
const DevVersion = PROJECT_INFO['subversion']['dev'];

const dev = new Command();

/* 基本信息 */
dev.name('dev')
	.description('A SubCommand within MuCli for SubCommand')
	.version(
		DevVersion,
		'-sv, --subversion',
		'output the subversion of MuCli-Dev'
	);

/* 创建子命令 */
dev.command('new')
	.option('-c, --command [command]', 'command name', 'test')
	.description('create a new command')
	.action(options => {
		let muc = new Dev();
		muc.createNew(options.command);
	});

/* 更新命令版本（包括主命令跟子命令 */
dev.command('update')
	.description('update a command version')
	.action(() => {
		let muc = new Dev();
		muc.updateVersion();
	});

export default dev;
