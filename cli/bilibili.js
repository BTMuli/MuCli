// Node JS
import { Command } from 'commander';
// MuCli JS
import Bilibili from '../utils/bilibili.js';

const bilibili = new Command();

// Base info
bilibili
	.name('bili')
	.description('A SubCommand within MuCli for Bilibili')
	.version('0.0.1', '-sv');

// SubCommand for get Info
bilibili
	.command('get')
	.option('-t, --type <type>', 'info type in Bilibili')
	.description('get info in Bilibili')
	.action(args => {
		let bili = new Bilibili();
		if (args.type) {
			bili.getInfo(args.type);
		} else {
			bili.getInfo();
		}
	});

// SubCommand for get userInfo
bilibili
	.command('get-u')
	.option('-uid, --userid <uid>', 'user ID in Bilibili')
	.option('-n, --username <name>', 'username in Bilibili')
	.description('get user info in Bilibili')
	.action(args => {
		let bili = new Bilibili();
		if (args.userid !== undefined) {
			bili.getUserInfo('userid', args);
		} else if (args.username !== undefined) {
			bili.getUserInfo('username', args);
		} else {
			bili.getUserInfo();
		}
	});

// SubCommand for get videoInfo
bilibili
	.command('get-v')
	.option('-bv <bv>', 'video ID in Bilibili')
	.option('-t, --title <title>', 'video title in Bilibili')
	.description('get video info in Bilibili')
	.action(args => {
		let bili = new Bilibili();
		if (args.bv !== undefined) {
			bili.getVideoInfo('bv', args);
		} else if (args.title !== undefined) {
			bili.getVideoInfo('title', args);
		} else {
			bili.getVideoInfo();
		}
	});

export default bilibili;
