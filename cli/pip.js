// Node JS
import { Command } from 'commander';
// MuCli JS
import Pip from '../utils/pip.js';

const pip = new Command();

// Base info
pip.name('pip')
	.description('A SubCommand within MuCli for pip')
	.version('0.1.0', '-sv');

// 安装包
pip.command('install')
	.description('install package')
	.option('-p, --package [package]', 'install package')
	.option('-r, --requirement [requirement]', 'install requirement')
	.action(args => {
		let pip = new Pip();
		pip.install(args);
	});

// 测试镜像源
pip.command('test')
	.description('test mirror')
	.action(async () => {
		let pip = new Pip();
		await pip.verifyMirror();
	});

// 查看镜像源
pip.command('show')
	.description('show mirror')
	.action(() => {
		let pip = new Pip();
		pip.showMirror();
	});
export default pip;
