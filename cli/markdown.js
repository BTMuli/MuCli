/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令，负责处理 markdown 文件
 * @update: 2021-12-06
 */

/* Node */
import { Command } from 'commander';
/* MuCli */
import Markdown from '../utils/markdown.js';
import { PROJECT_INFO } from '../config.js';

/* 版本管理 */
const MmdVersion = PROJECT_INFO['subversion']['mmd'];

const markdown = new Command();

/* 基本信息 */
markdown
	.name('mmd')
	.description('A SubCommand within MuCli for Markdown')
	.version(
		MmdVersion,
		'-sv, --subversion',
		'output the subversion of MuCli-Markdown'
	);

/* 建立新的 markdown 文件 */
markdown
	.command('new')
	.option('-n, --name <name>', 'the name of the new markdown file', 'README')
	.description('create a markdown file')
	.action(options => {
		let md = new Markdown();
		md.createNew(options.name);
	});

/* Typora 相关 */
markdown
	.command('typora')
	/* 通过 Typora 打开 markdown 文件 */
	.option('-n, --name [name]', 'the name of the markdown file', './')
	.description('open file with Typora')
	/* 获取 Typora 的路径 */
	.option('-p, --path', 'get local typora path')
	.description('get local typora path')
	.action(options => {
		let md = new Markdown();
		if (options.path) {
			console.log(md.getConfigTypora().path);
		} else if (options.name) {
			md.openTypora(options.name);
		}
	})
	.description('using local Typora - config is needed');

export default markdown;
