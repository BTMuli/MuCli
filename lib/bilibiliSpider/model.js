export class UserModel {
	constructor(info, other) {
		this.baseInfo = {
			uid: info['mid'],
			name: info['name'],
			sex: info['sex'],
			quote: info['sign'],
			level: info['level'],
			live: info['live_room']['roomid'],
			birthday: info['birthday'],
		};
		this.other = {
			following: other['following'],
			follower: other['follower']
		}
	}

	toString(type) {
		var res;
		switch (type) {
			case 'baseInfo':
				res = this.baseInfo;
				/* eslint-disable */
				return (
					'\nuid: ' + res.uid + '\t等级: ' + res.level +
					'\n生日: ' + res.birthday + '\t性别: ' + res.sex +
					'\n昵称: ' + res.name + '\t直播间: ' + res.live +
					'\n签名: ' + res.quote
				)
				/* eslint-disable */
		}

	}
}

export class VideoModel {}
