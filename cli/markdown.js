import {Command} from "commander";
import Markdown from "../utils/markdown.js";

const markdown = new Command();

// Base info
markdown
    .name('mmd')
    .description('A subsystem with MuCli for markdown.')
    .version('0.1.2', '-v')

// Command for create markdown new file
markdown
    .command('new')
    .option('-n [name]', 'new md file [name]','README')
    .description('create a markdown file')
    .action(args => {
        Markdown.createNew(args.n)
    })

export default markdown;
