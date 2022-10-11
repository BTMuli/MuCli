export class UserModel {
	constructor(args) {
		this.uid = args['mid'];
		this.name = args['name'];
		this.sex = args['sex'];
		this.quote = args['sign'];
	}

	output() {
		console.log(JSON.stringify(this));
	}
}

export class VideoModel {}
