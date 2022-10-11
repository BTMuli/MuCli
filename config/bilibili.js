// MuCli JS
import BilibiliSpider from '../lib/bilibiliSpider/index.js';

/**
 * todo
 */
class BilibiliModel {
	constructor() {
		this.bilibili = new BilibiliSpider();
	}

	getUserInfo(answer) {
		console.log('BilibiliModel.getUserInfo');
		console.log(answer);
		this.resData = this.bilibili.getUserInfo(
			answer.infoType,
			answer.infoData
		);
	}

	getVideoInfo(answer) {
		console.log('BilibiliModel.getVideoInfo');
		console.log(answer);
		this.resData = this.bilibili.getVideoInfo(
			answer.infoType,
			answer.infoData
		);
	}

	output() {
		if (this.resData !== undefined) {
			console.log(JSON.stringify(this.resData));
		}
	}
}

export default BilibiliModel;
