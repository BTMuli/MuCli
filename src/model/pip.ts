/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 pip 相关模型
 * @version 0.4.1
 */

/* Node */
import axios from "axios";
import { MirrorSingle } from "../interface/pip";

export class ModelMirror {
	name: string;
	url: string;
	usable: boolean;
	time: undefined | number;

	constructor(mirror: MirrorSingle) {
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
		let time: number;
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

export class ModelPip {
	mirrorUse: string;
	mirrorList: MirrorSingle[];

	constructor(mirrorUse: string, mirrorList: MirrorSingle[]) {
		this.mirrorUse = mirrorUse;
		this.mirrorList = mirrorList;
	}

	/**
	 * @description 获取所有镜像信息
	 * @return {Array<ModelMirror>} 镜像信息列表
	 */
	getMirrorList(): Array<ModelMirror> {
		return this.mirrorList.map(mirror => {
			return new ModelMirror(mirror);
		});
	}

	/**
	 * @description 获取当前使用的镜像信息
	 * @return {ModelMirror} 当前使用的镜像
	 */
	getMirrorUse(): ModelMirror {
		return new ModelMirror(
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
		const mirror: MirrorSingle = this.mirrorList.find(mirror => {
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
	 * @return {Promise<MirrorSingle[]>}
	 */
	async addMirror(name: string, url: string): Promise<MirrorSingle[]> {
		if (this.mirrorExist(name)) {
			console.log(`镜像 ${name} 已存在`);
			return;
		}
		const mirror = new ModelMirror({
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
		return this.mirrorList;
	}

	/**
	 * @description 删除镜像
	 * @param {string} name 镜像名称
	 * @return {MirrorSingle[]}
	 */
	deleteMirror(name: string): MirrorSingle[] {
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
		return this.mirrorList;
	}

	/**
	 * @description 更新镜像
	 * @param {string} name 镜像名称
	 * @param {string} url 镜像地址
	 * @return {Promise<MirrorSingle[]>}
	 */
	async updateMirror(name: string, url: string): Promise<MirrorSingle[]> {
		if (!this.mirrorExist(name)) {
			console.log(`镜像 ${name} 不存在`);
			return;
		}
		const mirrorModel = new ModelMirror({
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
		const mirror: MirrorSingle = this.mirrorList.find(mirror => {
			return mirror.name === name;
		});
		mirror.url = url;
		mirror.usable = true;
		console.log(`镜像 ${name} 已更新，耗时 ${timeTest} ms`);
		return this.mirrorList;
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
		const mirror: MirrorSingle = this.mirrorList.find(mirror => {
			return mirror.name === name;
		});
		const mirrorModel = new ModelMirror(mirror);
		const timeTest: number = await mirrorModel.verifyMirror();
		if (timeTest === -1 || timeTest >= 2000) {
			console.log(`镜像 ${name} 不可用`);
			return -1;
		}
		console.log(`镜像 ${name} 可用，耗时 ${timeTest} ms`);
		return timeTest;
	}
}
