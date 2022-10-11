// Node JS
import { Command } from 'commander';
// MuCli JS
import SubCommand from '../utils/SubCommand.js';

const subCommand = new Command();

// Base info
subCommand
	.name('ncm')
	.description('A SubCommand within MuCli for SubCommand')
	.version('0.0.2', '-sv');

// Command for create a new command(for dev)
subCommand
	.command('new')
	.option('-n [command]', 'new sub [command]')
	.action(args => {
		let muc = new SubCommand();
		muc.createNew(args.n);
	});

export default subCommand;
