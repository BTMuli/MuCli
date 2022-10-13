// MuCli JS
import BilibiliSpider from '../lib/bilibiliSpider/index.js';

/**
 * todo
 */
class BilibiliModel {
	constructor() {
		this.bilibili = new BilibiliSpider();
	}

	async getUserInfo(answer) {
		this.res = await this.bilibili.getUserInfo(
			answer.infoType,
			answer.infoData
		);
	}

	async getVideoInfo(answer) {
		this.res = await this.bilibili.getVideoInfo(
			answer.infoType,
			answer.infoData
		);
	}

	output() {
		if (this.res !== undefined) {
			console.log(this.res);
		}
	}
}

export default BilibiliModel;
