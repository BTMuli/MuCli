import {Command} from "commander";
import configAll from "../config/index.js";

const cliMarkdown = new Command();

// Base info
cliMarkdown
    .name('mmd')
    .description('A subsystem with MuCli for markdown.')
    .version('0.0.1', '-V')

// Command for test
cliMarkdown
    .command('test')
    .option('-t [command]', 'test [command] in mmd.', 'all')
    .description("A test module for mmd.")
    .action(args => {
        console.log("You are testing mmd(MuCli-Markdown) now...")
        if(args.t === 'all'){
            cliMarkdown.parse([configAll, 'mmd', '-V'])
        }
    });

export default cliMarkdown;
