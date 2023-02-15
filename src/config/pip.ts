/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 pip 相关模型
 * @version 0.4.0
 */

/* Node */
import axios from "axios";
import { PipMirror } from "utils/interface";

export class MirrorModel {
	name: string;
	url: string;
	usable: boolean;
	time: undefined | number;

	constructor(mirror: PipMirror) {
		this.name = mirror.name;
		this.url = mirror.url;
		if (mirror.usable !== undefined) {
			this.usable = mirror.usable;
		} else {
			this.usable = false;
		}
	}

	/**
	 * @description 测试镜像源是否可用
	 * @param {string} url 镜像源地址
	 * @return {Promise<number>} 测试结果
	 */
	async verifyMirror(url: string = undefined): Promise<number> {
		if (url === undefined) {
			url = this.url;
		}
		let time = 0;
		try {
			const startTime: number = new Date().getTime();
			await axios.get(url, {
				timeout: 5000,
			});
			const endTime: number = new Date().getTime();
			time = endTime - startTime;
		} catch (error) {
			time = -1;
		}
		return time;
	}

	/**
	 * @description 输出镜像信息
	 * @return {void}
	 */
	outputMirrorInfo(): void {
		console.log(
			`镜像名称：${this.name}，镜像地址：${this.url}，是否可用：${this.usable}`
		);
	}
}

export class PipModel {
	mirrorUse: string;
	mirrorList: PipMirror[];

	constructor(mirrorUse: string, mirrorList: PipMirror[]) {
		this.mirrorUse = mirrorUse;
		this.mirrorList = mirrorList;
	}

	/**
	 * @description 获取所有镜像信息
	 * @return {Array<MirrorModel>} 镜像信息列表
	 */
	getMirrorList(): Array<MirrorModel> {
		return this.mirrorList.map(mirror => {
			return new MirrorModel(mirror);
		});
	}

	/**
	 * @description 获取当前使用的镜像信息
	 * @return {MirrorModel} 当前使用的镜像
	 */
	getMirrorUse(): MirrorModel {
		return new MirrorModel(
			this.mirrorList.find(mirror => {
				return mirror.name === this.mirrorUse;
			})
		);
	}

	/**
	 * @description 输出所有镜像信息
	 * @return {void}
	 */
	outputMirrorList(): void {
		this.getMirrorList().forEach(mirror => {
			mirror.outputMirrorInfo();
		});
	}

	/**
	 * @description 检测镜像源是否存在
	 * @param {string} name 镜像名称
	 * @return {boolean} 是否存在
	 */
	mirrorExist(name: string): boolean {
		const mirror: PipMirror = this.mirrorList.find(mirror => {
			return mirror.name === name;
		});
		return mirror !== undefined;
	}

	/**
	 * @description 设置当前使用的镜像
	 * @param {string} name 镜像名称
	 * @return {void}
	 */
	setMirrorUse(name: string): void {
		if (!this.mirrorExist(name)) {
			console.log(`镜像 ${name} 不存在`);
			return;
		}
		this.mirrorUse = name;
		console.log(`当前使用的镜像已设置为：${name}`);
	}

	/**
	 * @description 添加镜像
	 * @param {string} name 镜像名称
	 * @param {string} url 镜像地址
	 * @return {Promise<void>}
	 */
	async addMirror(name: string, url: string): Promise<void> {
		if (this.mirrorExist(name)) {
			console.log(`镜像 ${name} 已存在`);
			return;
		}
		const mirror = new MirrorModel({
			name: name,
			url: url,
			usable: undefined,
			time: undefined,
		});
		const timeTest: number = await mirror.verifyMirror();
		if (timeTest === -1 || timeTest >= 2000) {
			console.log(`镜像 ${name} 不可用`);
			return;
		}
		this.mirrorList.push({
			name: name,
			url: url,
			usable: true,
			time: undefined,
		});
		console.log(`镜像 ${name} 已添加，耗时 ${timeTest} ms`);
	}

	/**
	 * @description 删除镜像
	 * @param {string} name 镜像名称
	 * @return {void}
	 */
	deleteMirror(name: string): void {
		if (!this.mirrorExist(name)) {
			console.log(`镜像 ${name} 不存在`);
			return;
		}
		this.mirrorList.splice(
			this.mirrorList.findIndex(mirror => {
				return mirror.name === name;
			}, 1)
		);
		console.log(`镜像 ${name} 已删除`);
	}

	/**
	 * @description 更新镜像
	 * @param {string} name 镜像名称
	 * @param {string} url 镜像地址
	 * @return {Promise<void>}
	 */
	async updateMirror(name: string, url: string): Promise<void> {
		if (!this.mirrorExist(name)) {
			console.log(`镜像 ${name} 不存在`);
			return;
		}
		const mirrorModel = new MirrorModel({
			name: name,
			url: url,
			usable: undefined,
			time: undefined,
		});
		const timeTest: number = await mirrorModel.verifyMirror();
		if (timeTest === -1 || timeTest >= 2000) {
			console.log(`镜像 ${name} 不可用`);
			return;
		}
		const mirror: PipMirror = this.mirrorList.find(mirror => {
			return mirror.name === name;
		});
		mirror.url = url;
		mirror.usable = true;
		console.log(`镜像 ${name} 已更新，耗时 ${timeTest} ms`);
	}

	/**
	 * @description 测试特定镜像
	 * @param {string} name 镜像名称
	 * @return {Promise<number>} 耗时
	 */
	async testMirror(name: string): Promise<number> {
		if (!this.mirrorExist(name)) {
			console.log(`镜像 ${name} 不存在`);
			return -1;
		}
		const mirror: PipMirror = this.mirrorList.find(mirror => {
			return mirror.name === name;
		});
		const mirrorModel = new MirrorModel(mirror);
		const timeTest: number = await mirrorModel.verifyMirror();
		if (timeTest === -1 || timeTest >= 2000) {
			console.log(`镜像 ${name} 不可用`);
			return -1;
		}
		console.log(`镜像 ${name} 可用，耗时 ${timeTest} ms`);
		return timeTest;
	}
}
