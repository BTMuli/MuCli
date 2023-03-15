/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 pip 相关模型
 * @version 0.4.3
 */

/* Node */
import axios from "axios";
import { Mirror, MirrorSingle } from "../interface/pip";

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
	current: string;
	list: MirrorSingle[];

	constructor(mirror: Mirror) {
		this.current = mirror.current;
		this.list = mirror.list;
	}

	/**
	 * @description 获取所有配置信息
	 * @return {Mirror} 配置信息
	 */
	getConfig(): Mirror {
		return {
			current: this.current,
			list: this.list,
		};
	}

	/**
	 * @description 获取所有镜像信息
	 * @return {Array<ModelMirror>} 镜像信息列表
	 */
	getMirrorList(): Array<ModelMirror> {
		return this.list.map(mirror => {
			return new ModelMirror(mirror);
		});
	}

	/**
	 * @description 获取当前使用的镜像信息
	 * @return {MirrorSingle} 当前使用的镜像
	 */
	getMirrorUse(): MirrorSingle {
		return this.list.find(mirror => {
			if (mirror.name.toString() === this.current) {
				return mirror;
			}
		});
	}

	/**
	 * @description 输出所有镜像信息
	 * @return {void}
	 */
	outputMirrorList(): void {
		const infoTable = [];
		this.getMirrorList().forEach(mirror => {
			infoTable.push({
				镜像名称: mirror.name,
				镜像地址: mirror.url,
				是否可用: mirror.usable ? "可用" : "不可用",
			});
		});
		console.table(infoTable, ["镜像名称", "镜像地址", "是否可用"]);
	}

	/**
	 * @description 检测镜像源是否存在
	 * @param {string} name 镜像名称
	 * @return {MirrorSingle|false} 镜像信息
	 */
	mirrorExist(name: string): MirrorSingle | false {
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i].name.toString() === name.toString()) {
				return this.list[i];
			}
		}
		return false;
	}

	/**
	 * @description 设置当前使用的镜像
	 * @param {string} name 镜像名称
	 * @return {void}
	 */
	setMirrorUse(name: string): void {
		const mirrorGet = this.mirrorExist(name);
		if (mirrorGet === false) {
			console.log(`镜像 ${name} 不存在`);
			return;
		}
		this.current = name;
		console.log(`当前使用的镜像已设置为：${name}`);
	}

	/**
	 * @description 添加镜像
	 * @param {string} name 镜像名称
	 * @param {string} url 镜像地址
	 * @return {Promise<void>}
	 */
	async addMirror(name: string, url: string): Promise<MirrorSingle[]> {
		if (this.mirrorExist(name) !== false) {
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
		this.list.push({
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
	deleteMirror(name: string): MirrorSingle[] {
		if (this.mirrorExist(name) === false) {
			console.log(`镜像 ${name} 不存在`);
			return;
		}
		this.list.splice(
			this.list.findIndex(mirror => {
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
	async updateMirror(name: string, url: string): Promise<MirrorSingle[]> {
		if (this.mirrorExist(name) === false) {
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
		const mirror: MirrorSingle = this.list.find(mirror => {
			return mirror.name === name;
		});
		mirror.url = url;
		mirror.usable = true;
		console.log(`镜像 ${name} 已更新，耗时 ${timeTest} ms`);
	}

	/**
	 * @description 测试特定镜像
	 * @param {MirrorSingle} mirror 镜像信息
	 * @return {Promise<number>} 耗时
	 */
	async testMirror(mirror: MirrorSingle): Promise<number> {
		const mirrorModel = new ModelMirror(mirror);
		const timeTest: number = await mirrorModel.verifyMirror();
		if (timeTest === -1 || timeTest >= 5000) {
			console.log(`镜像 ${mirror.name.toString()} 不可用`);
			return -1;
		}
		console.log(`镜像 ${mirror.name.toString()} 可用，耗时 ${timeTest} ms`);
		return timeTest;
	}
}
