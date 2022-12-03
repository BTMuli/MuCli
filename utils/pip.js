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
		let i;
		let mirrorListTest = this.mirrorList.mirrorList;
		console.log('正在测试镜像源,请稍后...');
		for (i = 0; i < mirrorListTest.length; i++) {
			var mirror = mirrorListTest[i];
			console.log('正在测试镜像源:' + mirror.name + '\t' + mirror.url);
			var result = await mirror.verifyMirror();
			if (result <= 5000 && result > 0) {
				mirrorListTest[i].usable = true;
				console.log('测试结果:' + result + 'ms');
			} else {
				mirrorListTest[i].usable = false;
				console.log('测试结果:超时或不可用');
			}
			mirrorListTest[i].time = result;
		}
		// 按照时间给镜像源排序，从小到大，但是-1的放在最后
		mirrorListTest.sort(function (a, b) {
			if (a.time === -1) {
				return 1;
			}
			if (b.time === -1) {
				return -1;
			}
			return a.time - b.time;
		});
		// 除去 time 属性
		for (i = 0; i < mirrorListTest.length; i++) {
			delete mirrorListTest[i].time;
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
		var url = this.mirrorList.useMirror.url;
		var command = '';
		// 获取运行命令目录下的python虚拟环境
		var venv = process.env.VIRTUAL_ENV;
		if (venv !== undefined) {
			venv = venv + '\\Scripts\\pip.exe';
		} else {
			venv = 'pip';
		}
		if (args.package !== undefined) {
			// 在虚拟环境中安装包
			command = venv + ' install ' + args.package + ' -i ' + url;
		} else if (args.requirement !== undefined) {
			command = venv + ' install -r ' + args.requirement + ' -i ' + url;
		}
		console.log('command:\t' + command);
		exec(command);
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
