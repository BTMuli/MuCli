import {Command} from "commander";
import markdown from "./markdown.js";
// import configAll from '../config/index.js'

const MuCli = new Command()

// Base info
MuCli
    .name('MuCli')
    .version('0.2.5', '-v, --version')
    .description("A Node Cli for Personal Use by BTMUli.");

// Command hello
MuCli
    .command('hello')
    .option('-n <name>', 'Your name', 'MuCli')
    .description("Say hello for user.")
    .action(args => {
        console.log("Hello "+ args.n +"!")
    });

// Command add mmd
MuCli
    .addCommand(markdown)

// Command for test
// MuCli
//     .command('test')
//     .option('-t [command]', 'test [command] in MuCli.', 'all')
//     .description('A test module for MuCli.')
//     .action(args =>  {
//         console.log("You are testing MuCli now...")
//         if(args.t === 'all'){
//             console.log("The version of MuCli is v0.2.0")
//             // markdown.parse( [configAll,'mmd', 'test'])
//         }
//
//     })

export default MuCli;
