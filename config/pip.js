/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 pip 相关模板
 * @update: 2022-12-14
 */

/* Node */
import axios from 'axios';

export class MirrorModel {
	constructor(mirror) {
		this.name = mirror.name;
		this.url = mirror.url;
		if (mirror.usable === true || mirror.usable === false) {
			this.usable = mirror.usable;
		} else {
			// 默认不可用
			this.usable = false;
		}
	}
	/**
	 * @description 测试镜像地址是否可用
	 * @param {string} url 镜像地址
	 */
	async verifyMirror(url = undefined) {
		if (url === undefined) {
			url = this.url;
		}
		let time;
		try {
			const start = new Date().getTime();
			await axios.get(url, {
				timeout: 5000,
			});
			const end = new Date().getTime();
			time = end - start;
		} catch (error) {
			time = -1;
		}
		return time;
	}
	/**
	 * @description 输出镜像信息
	 */
	outputMirrorInfo() {
		console.log(
			`镜像名称：${this.name}，镜像地址：${this.url}，是否可用：${this.usable}`
		);
	}
}

export class PipModel {
	constructor(mirrorUse, mirrorList) {
		this.mirrorUse = mirrorUse;
		this.mirrorList = mirrorList;
	}
	/**
	 * @description 获取所有镜像源信息
	 */
	getMirrorList() {
		this.mirrorList.forEach(mirror => {
			mirror.outputMirrorInfo();
		});
	}
	/**
	 * @description 获取当前使用的镜像源信息
	 * @return {MirrorModel} 镜像源
	 */
	getUseMirror() {
		return this.mirrorList.find(mirror => {
			return mirror.name === this.mirrorUse;
		});
	}
	/**
	 * @description 设置使用的镜像源
	 * @param name {String} 镜像源名称
	 */
	async setUseMirror(name) {
		this.mirrorUse = name;
		console.log(`已将使用的镜像源设置为：${name}`);
	}
	/**
	 * @description 添加镜像源
	 * @param name {String} 镜像源名称
	 * @param url {String} 镜像源地址
	 */
	async addMirror(name, url) {
		let mirror = new MirrorModel({
			name: name,
			url: url,
		});
		const time = await mirror.verifyMirror(url);
		if (time === -1 || time > 5000) {
			console.log('该镜像源不可用');
			return;
		}
		this.mirrorList.push(
			new MirrorModel({
				name,
				url,
				usable: true,
			})
		);
		console.log(`已添加 ${name} 镜像源，耗时 ${time} ms`);
	}
	/**
	 * @description 删除镜像源
	 * @param name {String} 镜像源名称
	 */
	deleteMirror(name) {
		const mirror = this.mirrorList.find(mirror => mirror.name === name);
		this.mirrorList.splice(this.mirrorList.indexOf(mirror), 1);
		console.log(`已删除 ${name} 镜像源`);
	}
	/**
	 * @description 更新镜像源
	 * @param name {String} 镜像源名称
	 * @param url {String} 镜像源地址
	 */
	async updateMirror(name, url) {
		const mirror = this.mirrorList.find(mirror => mirror.name === name);
		mirror.url = url;
		const time = await mirror.verifyMirror(url);
		if (time === -1 || time > 5000) {
			console.log('该镜像源不可用');
			return;
		}
		console.log(`已更新 ${name} 镜像源，耗时 ${time} ms`);
	}
	/**
	 * @description 检查镜像源是否存在
	 * @param name {String} 镜像源名称
	 * @return {Boolean} 是否存在
	 */
	checkMirrorExist(name) {
		return (
			this.mirrorList.find(mirror => mirror.name === name) !== undefined
		);
	}
	/**
	 * @description 测试特定镜像源
	 * @param name {String} 镜像源名称
	 * @return {Number} 耗时
	 */
	async testMirror(name) {
		const mirror = this.mirrorList.find(mirror => mirror.name === name);
		await console.log(`\n正在测试 ${name} 镜像源,url: ${mirror.url}`);
		const time = await mirror.verifyMirror();
		if (time === -1 || time > 5000) {
			await console.log('该镜像源不可用');
			return -1;
		}
		await console.log(`已测试 ${name} 镜像源，耗时 ${time} ms`);
		return time;
	}
}
