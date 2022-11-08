// Node JS
import { Command } from 'commander';
// MuCli JS
import Config from '../config/index.js';
import markdown from './markdown.js';
import subCommand from './SubCommand.js';

const MuCli = new Command();
let muc = new Config();

// Base info
MuCli.name('muc')
	.version('0.3.2', '-v, --version')
	.description('A Node Cli for Personal Use by BTMUli.');

// Load subCommand and setting
MuCli.command('set')
	.option('-n, --name [name]', 'see and set [name]', 'all')
	.description('change subcommand use status')
	.action(args => {
		if (args.n === 'ncm') {
			muc.setConfig(subCommand);
		} else if (args.n === 'mmd') {
			muc.setConfig(markdown);
		} else {
			muc.setConfig(markdown, subCommand);
		}
	});

/**
 * 检验权限然后添加命令
 * @param cmd 命令
 */
function setCommand(...cmd) {
	cmd.forEach(value => {
		if (muc.doConfig(value)) {
			MuCli.addCommand(value);
		}
	});
}

// Commands add
setCommand(markdown, subCommand);

export default MuCli;
