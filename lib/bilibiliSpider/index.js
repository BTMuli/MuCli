// Node JS
import axios from 'axios';
// MuCli JS
import Config from '../../config/index.js';
import { UserModel } from './model.js';
import MucFile from '../../utils/file.js';

// import MucConfig from '../../config.js';

class BilibiliSpider {
	// Api Refer https://www.bilibili.com/read/cv12357091
	constructor() {
		this.config = new Config().readDetailConfig('Commands', 'bili');
		this.api = this.config.api;
		this.dev = this.config.dev;
		this.file = new MucFile();
		this.request = axios.create();
	}

	/**
	 * 获取用户基本信息
	 * @param infoType 数据类型
	 * @param infoData 数据值
	 */
	async getUserInfo(infoType, infoData) {
		if (this.dev.enable === true) {
			var devinfo = this.file.read(this.dev.userInfoPath);
			await this.parseInfo('user', devinfo);
		} else {
			if (infoType === 'uid') {
				var path = this.api.upInfo.replace('{}', infoData);
				var res = (await this.request.get(path)).data;
				await this.parseInfo('user', res);
			}
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
