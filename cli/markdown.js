/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令，负责处理 markdown 文件
 * @update: 2021-12-14
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
		md.promoteFile(options.name);
	});

/* Typora 相关 */
markdown
	.command('typora')
	/* 通过 Typora 打开 markdown 文件 */
	.option('-n, --name [name]', 'the name of the markdown file')
	.description('open file with Typora')
	/* 获取 Typora 的路径 */
	.option('-i, --info', 'get the path of Typora')
	.description('get local typora path')
	/* 设置 Typora 的路径 */
	.option('-s, --set [path]', 'set the path of Typora')
	/* 测试 Typora 的配置 */
	.option('-t, --test', 'test the config of Typora')
	.action(options => {
		let md = new Markdown();
		if (options.info) {
			md.showTypora();
		} else if (options.set) {
			md.modifyTypora();
		} else if (options.name) {
			md.openTypora(options.name);
		} else if (options.test) {
			md.testTypora();
		} else {
			md.operaTypora();
		}
	});

/* markdown 模板相关 */
markdown
	.command('label')
	/* 获取模板列表 */
	.option('-l, --list', 'get the list of markdown label')
	.description('get the list of markdown label')
	/* 获取模板 */
	.option('-g, --get <name>', 'get the markdown label')
	.description('get the template')
	/* 删除模板 */
	.option('-d, --delete <name>', 'delete the markdown label')
	.description('delete the template')
	/* 添加模板 */
	.option('-a, --add <name>', 'add the markdown label')
	.description('add the template')
	.action(options => {
		let md = new Markdown();
		if (options.list) {
			md.getLabel('all');
		} else if (options.get) {
			md.getLabel(options.get);
		} else if (options.delete) {
			md.delLabel(options.delete);
		} else if (options.add) {
			md.addLabel(options.add);
		}
	});

export default markdown;
