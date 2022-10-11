// Node JS
import axios from 'axios';
// MuCli JS
import Config from '../../config/index.js';
import { UserModel } from './model.js';

// import MucConfig from '../../config.js';

class BilibiliSpider {
	// Api Refer https://www.bilibili.com/read/cv12357091
	constructor() {
		this.api = new Config().readDetailConfig('Commands', 'bili', 'APIs');
		this.request = axios.create();
	}

	/**
	 * 获取用户基本信息
	 * @param infoType 数据类型
	 * @param infoData 数据值
	 */
	async getUserInfo(infoType, infoData) {
		if (infoType === 'uid') {
			var path = this.api.upInfo.replace('{}', infoData);
			var res = (await this.request.get(path)).data;
			await this.parseInfo('user', res);
		}
	}

	/**
	 * todo 爬取数据
	 * @param infoType
	 * @param infoData
	 */
	getVideoInfo(infoType, infoData) {
		console.log('BilibiliSpider.getVideoInfo');
		console.log(infoType, infoData);
		return this.api;
	}

	async parseInfo(type, res) {
		if (type === 'user') {
			var user = new UserModel(res['data']);
			user.output();
		}
	}
}

export default BilibiliSpider;
