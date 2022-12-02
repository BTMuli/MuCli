//Node JS
import { exec } from 'child_process';
// MuCli JS
import { PipModel, MirrorModel } from '../config/pip.js';
import Config from '../config/index.js';

class Pip {
	/**
	 * 初始化构建各种设置
	 */
	constructor() {
		var pipConfig = new Config().readDetailConfig('Commands', 'pip');
		this.pipConfig = new Config();
		var mirrorList = [];
		var mirrorUse = undefined;
		for (var i = 0; i < pipConfig.mirrorList.length; i++) {
			var mirror = new MirrorModel(pipConfig.mirrorList[i]);
			if (mirror.usable === true && mirrorUse === undefined) {
				mirrorUse = mirror;
			}
			mirrorList.push(mirror);
		}
		if (mirrorUse === undefined) {
			mirrorUse = this.mirrorList[0];
		}
		this.mirrorList = new PipModel(mirrorUse, mirrorList);
	}

	/**
	 * 测试镜像源
	 */
	async verifyMirror() {
		let mirrorListTest = this.mirrorList.mirrorList;
		console.log('正在测试镜像源,请稍后...');
		for (var i = 0; i < mirrorListTest.length; i++) {
			var mirror = mirrorListTest[i];
			console.log('正在测试镜像源:' + mirror.name);
			var result = await mirror.verifyMirror();
			console.log('测试结果:' + result);
			mirrorListTest[i].usable = result;
		}
		// 将测试结果写入配置文件
		this.mirrorList.mirrorList = mirrorListTest;
		console.log('正在写入配置文件...');
		this.pipConfig.changeConfig(
			'pip',
			'mirrorList',
			this.mirrorList.mirrorList
		);
		console.log('写入配置文件成功');
	}

	/**
	 * 安装包
	 * @param args
	 */
	install(args) {
		// 根据镜像源url获取host --trusted-host
		var host = this.mirrorList.useMirror.url
		var command = 'pip install -i ' + host + ' ';
		if (args.package !== undefined) {
			command += args.package;
			console.log('command:\t' + command);
			// 在命令运行的目录下执行命令
			exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
				if (error) {
					console.error(`执行的错误: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});
		} else if (args.requirement !== undefined) {
			command += '-r ' + args.requirement;
			console.log('command:\t' + command);
			exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
				if (error) {
					console.error(`执行的错误: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});
		}
	}

	/**
	 * 查看镜像源
	 */
	showMirror() {
		console.log('当前使用镜像源:' + this.mirrorList.useMirror.name);
		console.log('镜像源列表:');
		this.mirrorList.getMirrorList();
	}
}

export default Pip;
