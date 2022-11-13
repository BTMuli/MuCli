// Node JS
import { Command } from 'commander';
// MuCli JS
import Config from '../config/index.js';
import markdown from './markdown.js';
import subCommand from './SubCommand.js';
import template from './template.js';

const MuCli = new Command();
let muc = new Config();

// Base info
MuCli.name('muc')
	.version('0.4.1', '-v, --version')
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

export default MuCli;
