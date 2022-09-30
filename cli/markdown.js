import {Command} from "commander";
import Markdown from "../utils/markdown.js";

const markdown = new Command();

// Base info
markdown
    .name('mmd')
    .description('A Sub Command within MuCli for Markdown.')
    .version('0.1.3', '-sv')

// Command for create markdown new file
markdown
    .command('new')
    .option('-n [name]', 'new markdown file [name]','README')
    .description('create a markdown file')
    .action(args => {
        let md = new Markdown()
        md.createNew(args.n)
    })

export default markdown;
