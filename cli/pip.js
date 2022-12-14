/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令，扶着处理 pip 镜像相关命令
 * @update: 2021-12-06
 */

/* Node */
import { Command } from 'commander';
/* MuCli */
import Pip from '../utils/pip.js';
import { PROJECT_INFO } from '../config.js';

/* 版本管理 */
const PipVersion = PROJECT_INFO['subversion']['pip'];

const pip = new Command();

/* 基本信息 */
pip.name('pip')
	.description('A SubCommand within MuCli for pip')
	.version(
		PipVersion,
		'-sv, --subversion',
		'output the subversion of MuCli-Pip'
	);

/* 安装包 */
pip.command('install')
	.description('install package')
	.option('-p, --package [package]', 'install package')
	.option('-r, --requirement [requirement]', 'install requirement')
	.action(options => {
		let pip = new Pip();
		pip.install(options);
	});

/* 测试镜像源 */
pip.command('test')
	.description('test mirror')
	.option('-n, --name [name]', 'mirror name')
	.action(async options => {
		let pip = new Pip();
		if (options.name) {
			await pip.verifyMirror(options.name);
		} else {
			await pip.verifyMirror();
		}
	});

/* 处理镜像源 */
pip.command('mirror')
	.description('handle mirror')
	.option('-a, --add [add]', 'add mirror')
	.option('-d, --delete [delete]', 'delete mirror')
	.option('-s, --set [set]', 'set mirror')
	.option('-l, --list', 'list mirror')
	.option('-u, --update', 'update mirror')
	.action(async options => {
		let pip = new Pip();
		if (options.add) {
			await pip.addMirror(options.add);
		} else if (options.delete) {
			await pip.deleteMirror(options.delete);
		} else if (options.set) {
			await pip.setMirror(options.set);
		} else if (options.update) {
			await pip.updateMirror();
		} else if (options.list) {
			await pip.listMirror();
		}
	});

export default pip;
