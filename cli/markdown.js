import {Command} from "commander";
import Markdown from "../utils/markdown.js";

const markdown = new Command();

// Base info
markdown
    .name('mmd')
    .description('A SubCommand within MuCli for Markdown')
    .version('0.3.0', '-sv')

// SubCommand for create markdown new file
markdown
    .command('new')
    .option('-n [name]', 'new markdown file [name]', 'README')
    .description('create a markdown file')
    .action(args => {
        let md = new Markdown()
        md.createNew(args.n)
    })

// SubCommand for open file with Typora - config is needed
markdown
    .command('typora')
    // Using Typora
    .option('-n [name]', 'open [name] with Typora', '')
    .description('open file with Typora - config is needed')
    .action(args => {
        let md = new Markdown()
        md.openTypora(args.n)
    })
    // Get Typora Info
    .option('-p, --path','get local typora path')
    .description('get local typora path')
    .action(() => {
        let md = new Markdown()
        console.log(md.getConfigTypora().path)
    })

export default markdown;
