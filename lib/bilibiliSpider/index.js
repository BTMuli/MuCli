// Node JS
import axios from 'axios';
// MuCli JS
import Config from '../../config/index.js';
import { UserModel } from './model.js';
import MucFile from '../../utils/file.js';

class BilibiliSpider {
	// Api Refer https://www.bilibili.com/read/cv12357091
	constructor() {
		this.config = new Config().readDetailConfig('Commands', 'bili');
		this.api = new Config(this.config.api.path).readConfig();
		this.dev = this.config.dev;
		this.file = new MucFile();
		this.request = axios.create();
	}

	/**
	 * 转换链接
	 * @param type 链接类型
	 * @param paths 链接地址
	 * @param args 填充数据
	 */
	transURL(type, paths, ...args) {
		var res = [];
		switch (type) {
			case 'upInfo':
				console.log(paths);
				paths.forEach(value => {
					res.push(value.replace('{}', args));
				});
				break;
			default:
				return 'BilibiliSpider.transURL.default';
		}
		return res;
	}

	/**
	 * 获取用户基本信息
	 * @param type 信息类型
	 * @param data 信息内容
	 */
	async getUserInfo(type, data) {
		var res;
		var info = [];
		if (this.dev.enable === true) {
			// todo dev模式下采用样例文件
			res = this.file.read(this.dev.userInfoPath);
			console.log(res);
			res = this.parse('user', res);
		} else {
			if (type === 'uid') {
				var paths = this.transURL(
					(type = 'upInfo'),
					(paths = this.api.user.info),
					data
				);
				for (var idx in paths) {
					console.log(paths[idx]);
					var pv = (await this.request.get(paths[idx])).data;
					info.push(pv);
				}
			}
		}
		console.log(info);
		// res = this.parse('user', info);
		// return res;
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

	/**
	 * 解析返回 Json
	 * @param type 数据类型
	 * @param datas 数据内容
	 * @return {Promise<string>} 解析完的数据
	 */
	async parse(type, datas) {
		var res;
		switch (type) {
			case 'user':
				res = new UserModel(datas);
				res = new UserModel(datas['data']).toString('baseInfo');
				break;
			default:
				res = datas.toString();
		}
		return res;
	}
}

export default BilibiliSpider;
