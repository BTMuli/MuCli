import axios from 'axios';

/**
 * 镜像模型
 */
export class MirrorModel {
	/**
	 * 构造函数
	 * @param mirror 镜像
	 */
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
	 * 获取镜像模型
	 */
	getModel() {
		return {
			name: this.name,
			url: this.url,
			usable: this.usable,
		};
	}

	/**
	 * 测试镜像地址是否可用
	 */
	async verifyMirror(url = undefined) {
		if (url === undefined) {
			url = this.url;
		}
		return await axios
			.get(url)
			.then(response => {
				return response.status === 200;
			})
			.catch(error => {
				console.log(error);
				return false;
			});
	}

	/**
	 * 获取镜像地址
	 */
	getMirrorUrl() {
		return this.url;
	}

	/**
	 * 获取镜像名称
	 */
	getMirrorName() {
		return this.name;
	}

	/**
	 * 更新镜像地址
	 */
	updateMirrorUrl(url) {
		this.url = url;
	}

	/**
	 * 输出镜像信息
	 */
	outputMirrorInfo() {
		console.log(
			// 左对齐
			`镜像名称：${this.name}，镜像地址：${this.url}，是否可用：${this.usable}`
		);
	}
}

export class PipModel {
	constructor(useMirror, mirrorList) {
		// 镜像源是否采用
		this.useMirror = useMirror;
		// 镜像源地址
		// {name: '清华', url: 'https://pypi.tuna.tsinghua.edu.cn/simple'}
		this.mirrorList = mirrorList;
	}

	/**
	 * 获取所有镜像源信息
	 * @return {Array<MirrorModel>} 镜像源信息
	 */
	getMirrorList() {
		this.mirrorList.forEach(mirror => {
			mirror.outputMirrorInfo();
		});
	}
}
