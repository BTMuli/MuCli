import {Command} from "commander";
import Markdown from "../utils/markdown.js";

const cliMarkdown = new Command();

// Base info
cliMarkdown
    .name('mmd')
    .description('A subsystem with MuCli for markdown.')
    .version('0.1.1', '-v')

// Command for create markdown new file
cliMarkdown
    .command('new')
    .option('-n [name]', 'new md file [name]','README')
    .description('create a markdown file')
    .action(args => {
        Markdown.init(args.n)
    })

// Command for test
// cliMarkdown
//     .command('test')
//     .option('-t [command]', 'test [command] in mmd.', 'all')
//     .description("A test module for mmd.")
//     .action(Markdown.init);

export default cliMarkdown;
