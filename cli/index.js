// Node JS
import { Command } from 'commander';
// MuCli JS
import Config from '../config/index.js';
import markdown from './markdown.js';
import subCommand from './SubCommand.js';
import bilibili from './bilibili.js';

const MuCli = new Command();

// Base info
MuCli.name('muc')
	.version('0.3.2', '-v, --version')
	.description('A Node Cli for Personal Use by BTMUli.');

/**
 * 检验权限然后添加命令
 * @param cmd 命令
 */
function setCommand(...cmd) {
	var config = new Config();
	cmd.forEach(value => {
		if (config.doConfig(value)) {
			MuCli.addCommand(value);
		}
	});
}

// Commands add
setCommand(markdown, subCommand, bilibili);

export default MuCli;
