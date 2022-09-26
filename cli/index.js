import {Command} from "commander";

const MuCli = new Command()

MuCli
    .version('0.1.1', '-v, --version')
    .description("A Node Cli for personal use by BTMUli.");

MuCli
    .command('hello')
    .option('-n <name>', 'Your name', 'MuCli')
    .description("Say hello for user.")
    .action((name) => {
        console.log(name)
    });

MuCli.parse(process.argv)
