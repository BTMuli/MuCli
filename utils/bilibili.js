// Node JS
import inquirer from 'inquirer';
// MuCli JS
import BilibiliModel from '../config/bilibili.js';

class Bilibili {
	constructor() {
		this.infoType = { user: 'user', video: 'video' };
	}

	/**
	 * 根据获取参数分配功能
	 * @param type 数据类型，或者 this.infoType 的索引
	 */
	getInfo(type) {
		if (type === undefined || !(type in this.infoType)) {
			inquirer
				.prompt([
					{
						type: 'list',
						message: '请选择你要输入的数据类型',
						name: 'infoType',
						choices: ['user', 'video'],
						default: 'user',
					},
				])
				.then(answer => {
					this.getInfo(answer.infoType);
				});
		} else if (type === 'user') {
			this.getUserInfo();
		} else if (type === 'video') {
			this.getVideoInfo();
		} else {
			console.log('Here is unavailable');
		}
	}

	/**
	 * 获取用户信息
	 * @param type 信息类型
	 * @param args 读取参数
	 */
	getUserInfo(type = null, args = undefined) {
		inquirer
			.prompt([
				{
					type: 'list',
					message: '请选择你要输入的数据类型',
					name: 'infoType',
					choices: ['uid', 'username'],
					default: type === null ? 'uid' : type,
				},
				{
					type: 'input',
					message: '请输入你要输入的数据',
					name: 'infoData',
					default: args === undefined ? undefined : args[type],
				},
			])
			.then(async answer => {
				var biliModel = new BilibiliModel();
				await biliModel.getUserInfo(answer);
				biliModel.output();
			});
	}

	/**
	 * 获取视频信息
	 * @param type 信息类型
	 * @param args 读取参数
	 */
	getVideoInfo(type = null, args = undefined) {
		inquirer
			.prompt([
				{
					type: 'list',
					message: '请选择你要输入的数据类型',
					name: 'infoType',
					choices: ['bv', 'title'],
					default: type === null ? 'bv' : type,
				},
				{
					type: 'input',
					message: '请输入你要输入的数据',
					name: 'infoData',
					default: args === undefined ? undefined : args[type],
				},
			])
			.then(answer => {
				var biliModel = new BilibiliModel();
				biliModel.getVideoInfo(answer);
				biliModel.output();
			});
	}
}

export default Bilibili;
