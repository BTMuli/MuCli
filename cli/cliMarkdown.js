import {Command} from "commander";
// import configAll from "../config/index.js";
import Markdown from "../utils/markdown.js";

const cliMarkdown = new Command();

// Base info
cliMarkdown
    .name('mmd')
    .description('A subsystem with MuCli for markdown.')
    .version('0.1.0', '-V')

// Command for create markdown new file
cliMarkdown
    .command('new')
    .option('-n [name]', 'new md file [name]','README')
    .description('create a markdown file')
    .action(args => {
        var path = process.cwd()
        var name = args.n
        Markdown.create(path,name);
    })

// Command for test
// cliMarkdown
//     .command('test')
//     .option('-t [command]', 'test [command] in mmd.', 'all')
//     .description("A test module for mmd.")
//     .action(args => {
//         console.log("You are testing mmd(MuCli-Markdown) now...")
//         if(args.t === 'all'){
//             cliMarkdown.parse([configAll, 'mmd', '-V'])
//         }
//     });

export default cliMarkdown;
