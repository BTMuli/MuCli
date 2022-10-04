import {Command} from "commander";
import SubCommand from "../utils/SubCommand.js";

const subCommand = new Command();

// Base info
subCommand
    .name('ncm')
    .description('create a sub command')
    .version('0.0.1', '-sv')

// Command for create a new command(for dev)
subCommand
    .option('-n [command]', 'new sub [command]')
    .action(args => {
        let muc = new SubCommand()
        muc.createNew(args.n)
    })

export default subCommand
