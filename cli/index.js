// Node JS
import { Command } from 'commander';
// MuCli JS
import Config from '../config/index.js';
// SubCommand
import markdown from './markdown.js';
import subCommand from './SubCommand.js';
import template from './template.js';
import pip from './pip.js';

const MuCli = new Command();
let muc = new Config();

// Base info
MuCli.name('muc')
	.version('0.5.2', '-v, --version')
	.description('A Node Cli for Personal Use by BTMUli.');

// Load subCommand and setting
MuCli.command('set')
	.option('-n, --name [name]', 'see and set [name]', 'all')
	.option('-t, --target [status]', 'set [target] to [status]', 'on')
	.description('change subcommand use status')
	.action(args => {
		if (args.name && args.target) {
			muc.transConfig(args.name, args.target);
			muc.setConfig(MuCli, markdown, subCommand, template, pip);
		} else if (args.name) {
			muc.transConfig(args.name, 'on');
			muc.setConfig(MuCli, markdown, subCommand, template, pip);
		} else {
			console.log('Please input a name.');
		}
	});

export default MuCli;
